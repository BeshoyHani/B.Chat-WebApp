const friendModel = require('../models/friend-model');

exports.sendFriendRequest = (req, res, next) => {
    friendModel.send_friend_request(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
}

exports.unFriend = (req, res, next) => {
    friendModel.unfriend(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
}

exports.acceptRequest = (req, res, next) => {
    friendModel.accept_request(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
}

exports.cancelRequest = (req, res, next) => {
    friendModel.cancel_request(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
}

exports.rejectRequest = (req, res, next) => {
    friendModel.reject_request(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
}

exports.getFirst3FriendRequest = (req, res, next) => {
    if (req.session.userId) {
        friendModel.get_first_three_friend_requests(req.session.userId)
            .then(requests => {
                req.friendRequests = requests;
                next();
            });

    } else next();
}

exports.getFriendRequests = (req, res, next) => {
    friendModel.get_friend_requests(req.session.userId)
        .then(requests => {
            res.render('friend-requests', {
                requests: requests,
                friendRequests: req.friendRequests,
                type: "recieved",
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: 'Friend Requests',
                toastMessage: req.flash('toastMessage')
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        });
}
exports.getSentRequests = (req, res, next) => {
    friendModel.get_sent_requests(req.session.userId)
        .then(requests => {
            res.render('friend-requests', {
                requests: requests,
                friendRequests: req.friendRequests,
                type: "sent",
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: 'Friend Requests',
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        });
}

exports.getAllFriends = (req, res, next) => {
    let myId = req.session.userId;
    friendModel.get_friends(myId)
        .then(friends => {
            res.render('my-friends', {
                friends: friends,
                friendRequests: req.friendRequests,
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: 'My Friends',
            })
        })
}