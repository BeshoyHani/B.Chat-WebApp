const friendModel = require('../models/friend-model');

module.exports = (io, socket) => {
    socket.on('sendFriendRequest', data => {
        friendModel.send_friend_request(data)
            .then(() => {
                socket.emit('requestSent');
                io.to(data.friendId)
                    .emit('newFriendRequest', {
                        name: data.myName,
                        id: data.myId,
                        image: data.myImage
                    });
            })
            .catch(err => {
                socket.emit('requestFailed');
                console.log('Besh friend Scocket \n' + err)
            });
    });


    socket.on('getOnlineFriends', id => {
        console.log('id: ', id)
        friendModel.get_friends(id)
            .then(friends => {
                let onlineFriends = friends.filter(friend => io.onlineUsers[friend.id]);
                socket.emit('onlineFriends', onlineFriends);
            });
    });
}