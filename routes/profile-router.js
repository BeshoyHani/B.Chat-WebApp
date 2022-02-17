const router = require('express').Router();
const bodyParser = require('body-parser').urlencoded({ extended: true });
const profileController = require('../controllers/profile-controller');
const authGuard = require('./guards/auth-guard');
const multer = require('multer');

router.get('/', authGuard.isAuth, profileController.redirect);

router.get('/:id',authGuard.isAuth ,profileController.getProfile);

router.post('/update', authGuard.isAuth,
    multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, 'images/profile');
            },
            filename: (req, file, callback) => {
                let extension = file.mimetype.split("/")[1];
                callback(null, 'file-' + Date.now() + '.' + extension);
            }
        })
    }).single('image'),
    profileController.updateProfile);


module.exports = router;