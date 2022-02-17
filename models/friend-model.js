const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/B-Chat';
const User = require('./user-model').User;
const Chat = require('./chat-model');

exports.send_friend_request = async (data) => {
    /*
        add me in friend's friend request list
        add friend in my sent request list
    */
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            { $push: { friendRequests: { id: data.myId, name: data.myUsername, image: data.myImage } } }
        );

        await User.updateOne(
            { _id: data.myId },
            { $push: { sentRequests: { id: data.friendId, name: data.friendUsername, image: data.friendImage } } }
        );

        mongoose.disconnect();
        return;

    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}


exports.unfriend = async (data) => {
    /*
        Remove me from friend's friends list
        Remove friend from my friends list
    */
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friends: { id: data.myId } } }
        );

        await User.updateOne(
            { _id: data.myId },
            { $pull: { friends: { id: data.friendId } } }
        );

        mongoose.disconnect();
        return;

    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}


exports.accept_request = async (data) => {
    /*
        Remove me from friend sent requests
        Remove friend from my friend requests
        Add each of us in the other friends
    */
    date = new Date();
    let today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    let userIDs = [data.myId, data.friendId].sort();

    let chat = await Chat.create_new_chat(userIDs)
        .then(id => {
            return id;
        })
        .catch(err => console.log(err));

    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            {
                $pull: { sentRequests: { id: data.myId } },
                $push: {
                    friends: {
                        id: data.myId, name: data.myUsername, image: data.myImage,
                        status: data.myStatus, chatId: chat, since: today, whoSent: true
                    }
                }
            }
        );

        await User.updateOne(
            { _id: data.myId },
            {
                $pull: { friendRequests: { id: data.friendId } },
                $push: {
                    friends: {
                        id: data.friendId, name: data.friendUsername, image: data.friendImage,
                        status: data.friendStatus, chatId: chat, since: today, whoSent: false
                    }
                }
            }
        );

        mongoose.disconnect();
        return;

    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}

exports.cancel_request = async (data) => {
    /*
        Remove me from my friend's friends requests
        Remove friend from my sent requests
    */
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friendRequests: { id: data.myId } } }
        );

        await User.updateOne(
            { _id: data.myId },
            { $pull: { sentRequests: { id: data.friendId } } }
        );

        mongoose.disconnect();
        return;

    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}

exports.reject_request = async (data) => {
    /*
        Remove me from my friend sent requests
        Remove friend from my friend requests
    */
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { sentRequests: { id: data.myId } } }
        );

        await User.updateOne(
            { _id: data.myId },
            { $pull: { friendRequests: { id: data.friendId } } }
        );

        mongoose.disconnect();
        return;

    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}

exports.get_first_three_friend_requests = async (id) => {
    try {
        await mongoose.connect(DB_URL)
        let user = await User.findById(id, { friendRequests: true }).limit(3);
        mongoose.disconnect();
        return user.friendRequests;
    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}

exports.get_friend_requests = async (id) => {
    try {
        await mongoose.connect(DB_URL)
        let user = await User.findById(id, { friendRequests: true });
        mongoose.disconnect();
        return user.friendRequests;
    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}

exports.get_sent_requests = async (id) => {
    try {
        await mongoose.connect(DB_URL)
        let user = await User.findById(id, { sentRequests: true });
        mongoose.disconnect();
        return user.sentRequests;
    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}


exports.get_friends = async (id) => {
    try {
        await mongoose.connect(DB_URL)
        let user = await User.findById(id, { friends: true });
        mongoose.disconnect();
        return user.friends;
    } catch (err) {
        mongoose.disconnect();
        console.log(err);
    }
}