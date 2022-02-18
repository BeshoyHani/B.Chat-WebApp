const router = require('express').Router();
const chatController = require('../controllers/chat-controller');
const multer = require('multer')
const { diskStorage } = require('multer');
const authGuard = require('./guards/auth-guard');
const bodyParser = require('body-parser').urlencoded({ extended: true });
const check = require('express-validator').check;

router.get('/:id', authGuard.isAuth, chatController.getChat);

router.post('/sendImage', authGuard.isAuth,
    multer({
        storage: diskStorage({
            destination: (req, file, callback) => {
                callback(null, 'images/chat');
            },
            filename: (req, file, callback) => {
                let extension = file.mimetype.split("/")[1];
                callback(null, 'file-' + Date.now() + '.' + extension);
            }
        })
    }).single('content'),
    chatController.saveMessage);

router.get('/group/all', authGuard.isAuth, chatController.getGroupList);

router.get('/group/create', authGuard.isAuth, chatController.getCreateGroup);

router.post('/group/create', authGuard.isAuth,
    multer({
        storage: diskStorage({
            destination: (req, file, callback) => {
                callback(null, 'images/group');
            },
            filename: (req, file, callback) => {
                let extension = file.mimetype.split("/")[1];
                callback(null, 'file-' + Date.now() + '.' + extension);
            }
        })

    }).single('image'),
    check('IDs').isArray({ min: 2 })
        .withMessage('Choose at least one friend'),
    chatController.createGroup);

router.get('/group/:id', authGuard.isAuth, chatController.getGroupMessages);

module.exports = router;