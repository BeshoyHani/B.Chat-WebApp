const userModel = require('../models/user-model');

exports.getMatchedUsers = (req, res, next) => {
    let keyword = req.query.keyword;
    userModel.get_matched_users(keyword)
        .then(results => {
            let users = results.filter(user => String(user._id) !== req.session.userId);


            res.render('search-result', {
                friendRequests: req.friendRequests,
                searchResult: users,
                userName: req.session.userName,
                userEmail: req.session.userEmail,
                userImage: req.session.userImage,
                userId: req.session.userId,
                pageTitle: 'Results',
            })
        })
        .catch(err => {
            console.log('search model : ', err);
            res.redirect('/error');
        });
}