const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')
const tweetsController = require('../controllers/tweets.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('./cloudinary.config');

module.exports = router;

router.get('/tweets', authMiddleware.isAuthenticated, tweetsController.index)
router.get('/tweets/:id', authMiddleware.isAuthenticated, tweetsController.show)
router.post('/tweets/:id/comments', authMiddleware.isAuthenticated, tweetsController.addComment)
router.post('/tweets/:id/like', authMiddleware.isAuthenticated, tweetsController.like)
router.post('/tweets', authMiddleware.isAuthenticated, upload.single('image'), tweetsController.create)

router.post('/users', authMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.create)
router.get('/users/:username', authMiddleware.isAuthenticated, tweetsController.profile)

router.get('/auth/slack', authMiddleware.isNotAuthenticated, usersController.doSocialLogin);
router.post('/login', authMiddleware.isNotAuthenticated, usersController.doLogin)
router.post('/logout', authMiddleware.isAuthenticated, usersController.logout)
