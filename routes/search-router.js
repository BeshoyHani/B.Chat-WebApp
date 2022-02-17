const router = require('express').Router();
const authGuard = require('./guards/auth-guard');
const searchController = require('../controllers/search-controller');

router.get('/:keyword', authGuard.isAuth, searchController.getMatchedUsers);

module.exports = router;