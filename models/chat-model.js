const DB_URL = 'mongodb://localhost:27017/B-Chat';
const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

const Chat = mongoose.model('chat', chatSchema);

exports.create_new_chat = async (data) => {
    try {
        //if they already have a chat get it
        await mongoose.connect(DB_URL);
        let chat = await Chat.findOne({ members: data })
        if (chat) {
            mongoose.disconnect();
            return chat._id;

            //else create new one
        } else {
            let newChat = new Chat({
                members: data
            });
            chat = await newChat.save();
            mongoose.disconnect();
            return chat._id;
        }

    } catch (err) {
        mongoose.disconnect();
        console.log('create chat : ', err);
    }
}

exports.get_chat_info = async id => {
    try {
        await mongoose.connect(DB_URL);
        let chat_info = await Chat.findById(id).populate('members');
        mongoose.disconnect();
        return chat_info;
    }catch(err){
        mongoose.disconnect();
        console.log(err);
    }
}


exports.Chat = Chat;