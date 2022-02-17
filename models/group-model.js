const DB_URL = 'mongodb://localhost:27017/B-Chat';
const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    name: String,
    image: {
        type: String,
        default: 'group-chat.png'
    },
    timeStamp: Date
});

const Group = mongoose.model('group', groupSchema);


exports.create_new_group = async (data, image) => {
    try {
        await mongoose.connect(DB_URL);
        let group = new Group({
            members: data.IDs.sort(),
            name: data.name,
            image: image,
            timeStamp: Date.now()
        });

        let newGroup = await group.save();
        mongoose.disconnect();
        return newGroup._id;
    } catch (err) {
        console.log('create group: ', err);
    }
}

exports.get_groups = async IDs => {
    try {
        await mongoose.connect(DB_URL);
        let list = await Group.find({
            _id: {
                $in: IDs
            }
        });

        mongoose.disconnect();
        return list;
    } catch (err) {
        mongoose.disconnect()
        console.log('get groups: ', err);
    }
}

exports.get_group_info = async id => {
    try {
        await mongoose.connect(DB_URL);
        let group_info = await Group.findById(id).populate('members');
        mongoose.disconnect();
        return group_info;
    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}

exports.Group = Group;