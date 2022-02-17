const messageModel = require("../models/message-model");

module.exports = (io, socket) => {
    socket.on('joinChat', chatId => {
        socket.join(chatId);
    });

    socket.on('sendMessage', (data, callback) => {
        if (data.contentType === 'text') {
            messageModel.save_message({
                chatId: data.chatId,
                content: data.content,
                contentType: data.contentType,
                sender: data.sender
            })
                .then(() => {
                    io.to(data.chatId).emit('newMessage', data);
                    callback();
                })
        } else {
            io.to(data.chatId).emit('newMessage', data);
        }
    });
}