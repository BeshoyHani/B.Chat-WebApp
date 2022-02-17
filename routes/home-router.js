const router = require('express').Router();
const homeController = require('../controllers/home-controller');
const authGaurd = require('../routes/guards/auth-guard');

router.get('/', authGaurd.isAuth, homeController.getHome);

module.exports = router;