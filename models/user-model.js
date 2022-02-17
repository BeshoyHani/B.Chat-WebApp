const DB_URL = 'mongodb://localhost:27017/B-Chat';
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    status: { type: String, default: 'Hey Iam Using B-Chat' },
    image: { type: String, default: 'user.png' },
    isOnline: { type: Boolean, default: false },
    friends: {
        type: [{ id: String, name: String, image: String, status: String, chatId: String, since: String, whoSent: Boolean }],
        default: []
    },
    friendRequests: {
        type: [{ name: String, id: String, image: String }],
        default: []
    },
    sentRequests: {
        type: [{ name: String, id: String, image: String }],
        default: []
    },
    groupList: {
        type: [String],
        default: []
    }
});

const User = mongoose.model('user', userSchema);

exports.getUserData = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return User.findById(id)
            })
            .then(data => {
                mongoose.disconnect();
                resolve(data);
            })
            .catch(err => {
                mongoose.disconnect();
                console.log("get user data \n\n" + err);
                reject(err);
            })
    });
}


exports.update_user_data = async (id, data) => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne({ _id: id }, data);
        mongoose.disconnect();
        return;
    } catch (err) {
        mongoose.disconnect();
        console.log("update user data \n\n" + err);
        console.log(err);
    }
}

exports.get_matched_users = async keyword => {
    try {
        await mongoose.connect(DB_URL);
        let users = await User.find({
            'username': {
                '$regex': keyword,
                '$options': 'i'
            }
        });
        mongoose.disconnect();
        return users;
    } catch (err) {
        mongoose.disconnect();
        console.log('get matched users', err);
    }
}


exports.update_user_group_list = async (userIDs, groupID) => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateMany({
            _id: {
                $in: userIDs
            }
        },
            {
                $push: {
                    groupList: groupID
                }
            });
        mongoose.disconnect();
        return;
    } catch (err) {
        mongoose.disconnect();
        console.log('update group list: ', err);
    }
}

exports.get_group_list = async myID => {
    try {
        await mongoose.connect(DB_URL);
        let userData = await User.findById(myID, { groupList: true });
        mongoose.disconnect();
        return userData.groupList;
    } catch (err) {
        mongoose.disconnect();
        console.log('get group list', err);
    }
}

exports.User = User;