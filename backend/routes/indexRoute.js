const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { check } = require('express-validator');
const passport = require('passport');

router.use(passport.authenticate('jwt', { session: false }));

router.get('/', postController.getPosts);

router.get('/:id', postController.getPost);

router.post('/create',
    [
        check('user_id').trim().escape(),
        check('content', `Your post can't be empty`).not().isEmpty().trim().escape(),
    ],
    postController.postCreatePost,
);

const reactionOpt = ['Like', 'Love', 'Hug', 'Haha', 'Wow', 'Sad', 'Angry'];

router.put('/:id/react',
    [
        check('reaction', 'Invalid reaction')
            .isLength({ min: 1 })
            .custom((val, { req }) => reactionOpt.includes(val))
            .trim()
            .escape(),
    ],
    postController.putLike,
);

router.put('/:id/comment',
    [
        check('content', 'Your comment must have something in it')
            .isLength({ min: 1 })
            .trim()
            .escape(),
    ],
    postController.putComment,
);

router.delete('/:id', postController.deletePost);

router.put('/:id',
    [ check('content', `Your post can't be empty`).not().isEmpty().trim().escape() ],
    postController.updatePost,
);

module.exports = router;
