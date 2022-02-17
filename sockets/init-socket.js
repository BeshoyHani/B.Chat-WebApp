module.exports = (io, socket) => {
    socket.on('joinNotificationRoom', id => {
        socket.join(id);
    });

    socket.on('goOnline', id => {
        io.onlineUsers[id] = true;

        socket.on('disconnect', id => {
            io.onlineUsers[id] = false;
        })
    })
}