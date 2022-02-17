const router = require('express').Router();
const bodyParser = require('body-parser');
const authController = require('../controllers/auth-controller');
const check = require('express-validator').check;
const guard = require('./guards/auth-guard');


router.get('/signup', guard.notAuth, authController.getSignup);

router.post('/signup', guard.notAuth,
    bodyParser.urlencoded({ extended: true }),
    check('username').not().isEmpty()
        .withMessage('Username is required'),
    check('email').not().isEmpty()
        .withMessage('Email is Required'),
    check('password').isLength({ min: 8 })
        .withMessage('Password must be at least 8 digits long'),
    check('confirm-password').custom((value, { req }) => {
        console.log(value)
        if (value === req.body.password)
            return true;
        else throw 'Password mismatch';
    })
        .withMessage('Password doesn\'t match'),
    authController.postSignup);


router.get('/login', guard.notAuth, authController.getLogin);


router.post('/login', guard.notAuth, bodyParser.urlencoded({ extended: true }),
    check('email').not().isEmpty()
        .withMessage(`Email can't be empty.`),
    check('password').not().isEmpty()
        .withMessage(`Password can't be empty.`),
    authController.postLogin);

    
router.all('/logout', guard.isAuth, authController.logout);

module.exports = router;