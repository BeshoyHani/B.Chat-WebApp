const userModel = require('../models/user-model');

exports.redirect = (req, res, next) => {
    res.redirect('/profile/' + req.session.userId);
}

exports.getProfile = (req, res, next) => {
    let id = req.params.id || req.session.userId;
    userModel
    .getUserData(id)
    .then(friend => {            
            res.render('profile', {
                userId: req.session.userId,
                userName: req.session.userName,
                userImage: req.session.userImage,
                userStatus: req.session.userStatus,
                friend: friend,       
                pageTitle: req.session.userName,
                friendRequests: req.friendRequests, // friend Reqs
                isOwner: id === req.session.userId, //Does the profile belongs to the current user
                areFriends: friend.friends.find(friend => friend.id === req.session.userId), // Does this profile is a friend to the current user
                hasSentRequest: friend.friendRequests.find(friend => friend.id === req.session.userId), // Does the current user had sent request to this profile
                hasReceivedRequest: friend.sentRequests.find(friend => friend.id === req.session.userId), // does the current user had received a request from this profile
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.updateProfile = (req, res, next) => {
    let image = req.session.userImage;
    
    if (req.file !== undefined)
        image = req.file.filename;

    userModel.update_user_data(req.session.userId, {
        username: req.body.username,
        status: req.body.status,
        image: image
    })
        .then(() => {
            req.session.userName = req.body.username;
            req.session.userImage = image;
            res.redirect('/profile');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        })
}