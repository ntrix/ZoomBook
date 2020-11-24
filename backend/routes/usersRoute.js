const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requestController = require('../controllers/requestController');
const postController = require('../controllers/postController');
const { check } = require('express-validator');
const passport = require('passport');

router.post('/login',
    [
        check('email', 'Email must be valid').isEmail().trim().escape(),
        check('password', 'Password must be at least 8 characters long')
            .isLength({ min: 8 })
            .trim()
            .escape(),
    ],
    userController.login,
);

router.post('/signup',
    [
        check('first_name', 'First name is required').isLength({ min: 1, max: 50 }).trim().escape(),
        check('last_name', 'Last name is required').isLength({ min: 1, max: 50 }).trim().escape(),
        check('password', 'Password must be at least 8 characters long')
            .isLength({ min: 8 })
            .trim()
            .escape(),
        check('password_confirmation', 'Passwords must match')
            .custom((value, { req }) => value === req.body.password)
            .trim()
            .escape(),
        check('email', 'Email must be valid').isEmail().trim().escape(),
        check(['day', 'month', 'year'], 'Birthday is required').not().isEmpty().trim().escape(),
        check('gender', 'Choose a gender').not().isEmpty().trim().escape(),
    ],
    userController.signup,
);

router.post('/friend-request/:fromUserID/send/:toUserID', requestController.postSendRequest);

router.put('/friend-request/:fromUserID/accept/:toUserID', requestController.putAcceptRequest);

router.put('/friend-request/:fromUserID/decline/:toUserID', requestController.putDeclineRequest);

router.use(passport.authenticate('jwt', { session: false }));

router.get('/:id', userController.getUser);

// get 5 random non friend user
router.get('/:id/new-people', userController.getNewUsers);

router.get('/:id/search', userController.searchUsers);

router.get('/:id/profile/posts', postController.getUserPosts);

router.put('/:id/profile',
    [
        check('first_name', 'First name is required').isLength({ min: 1, max: 50 }).trim().escape(),
        check('last_name', 'Last name is required').isLength({ min: 1, max: 50 }).trim().escape(),
        check('bio', 'Bio must have up to 101 characters').trim().escape(),
    ],
    userController.putUserUpdate,
);

module.exports = router;
