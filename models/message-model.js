const DB_URL = 'mongodb://localhost:27017/B-Chat';
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId},
    content: String,
    contentType: String,
    sender: String,
    timeStamp: Date
});

const Message = mongoose.model('message', messageSchema);


exports.get_messages = async (id, model) => {
    try {
        await mongoose.connect(DB_URL);
        let messages = await Message.find({ chatId: id }, null, {
            sort:{
                timeStamp: 1
            }
        }).populate({
            path: 'chatId', //field
            model: model, //model
            populate: {
                path: 'members', //field
                model: 'user', //model
                select: 'username status image'
            }
        });
        mongoose.disconnect();
        return messages;
    }catch(err){
        mongoose.disconnect();
        console.log('get messages: ', err);
    }
}

exports.save_message = async data => {
    try{
        await mongoose.connect(DB_URL);
        let message = new Message(data);
        message.timeStamp = Date.now();
        await message.save();
        mongoose.disconnect();
        return;
    }catch(err){
        mongoose.disconnect();
        console.log('save message: ', err);
    }
}


exports.Message = Message;