const router = require('express').Router();
const bodyParser = require('body-parser').urlencoded({extended: true});
const authGuard = require('./guards/auth-guard');
const friendController = require('../controllers/friend-controller');

router.post('/add', authGuard.isAuth, bodyParser, friendController.sendFriendRequest);

router.post('/unfriend', authGuard.isAuth, bodyParser, friendController.unFriend);

router.post('/cancel', authGuard.isAuth, bodyParser, friendController.cancelRequest);

router.post('/accept', authGuard.isAuth, bodyParser, friendController.acceptRequest);

router.post('/reject', authGuard.isAuth, bodyParser, friendController.rejectRequest);

router.get('/friend-requests', authGuard.isAuth, bodyParser, friendController.getFriendRequests);

router.get('/sent-requests', authGuard.isAuth, bodyParser, friendController.getSentRequests);

router.get('/all-friends', authGuard.isAuth, bodyParser, friendController.getAllFriends);

module.exports = router;

