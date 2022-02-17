
exports.getHome = (req, res, next) => {
    res.render('home', {
        friendRequests: req.friendRequests,
        userName: req.session.userName,
        userEmail: req.session.userEmail,
        userImage: req.session.userImage,
        userId: req.session.userId,
        pageTitle: 'Online Friends',
    });
}