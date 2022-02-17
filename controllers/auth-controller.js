const authModel = require('../models/auth-model');
const validatorResult = require('express-validator').validationResult;


exports.getSignup = (req, res, next) => {
    res.render('signup', {
        userName: req.session.userName,
        userImage: req.session.userImage,
        userId: req.session.userId,
        friendRequests: req.friendRequests, // friend Reqs
        validateInput: req.flash('signUpValidationErrors'),
        pageTitle: 'Signip',
    });
}

exports.postSignup = (req, res, next) => {
    if (validatorResult(req).isEmpty()) {
        let email = req.body.email.toLowerCase();
        authModel.createNewUser(req.body.username, email, req.body.password)
            .then(() => res.redirect('/login'))
            .catch(err => res.redirect('/signup'));
    } else {
        req.flash('signUpValidationErrors', validatorResult(req).array());
        res.redirect('signup');
    }
}

exports.getLogin = (req, res, next) => {
    res.render('login', {
        authError: req.flash('authError')[0],
        friendRequests: req.friendRequests, // friend Reqs
        validateInput: req.flash('loginValidationErrors'),
        userName: req.session.userName,
        userEmail: req.session.userEmail,
        userImage: req.session.userImage,
        userId: req.session.userId,
        pageTitle: 'Login',
    });
}

exports.postLogin = (req, res, next) => {
    if (validatorResult(req).isEmpty()) {
        let email = req.body.email.toLowerCase();
        authModel.login(email, req.body.password)
            .then(userData => {
                req.session.userId = String(userData.userId);
                req.session.userName = userData.userName;
                req.session.userStatus = userData.userStatus;
                req.session.userEmail = userData.userEmail;
                req.session.userImage = userData.userImage;
                res.redirect('/');
            })
            .catch(err => {
                req.flash('authError', err);
                res.redirect('/login');
                console.log("post login \n\n" +err);
            })
    }else {
        req.flash('loginValidationErrors', validatorResult(req).array());
        res.redirect('login');
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}