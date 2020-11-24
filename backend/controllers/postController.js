const { Post, Reaction, Comment, User } = require('../models');
const dayjs = require('dayjs');
const { validationResult } = require('express-validator');

// Get friends' new posts on time line news feed
exports.getPosts = function (req, res, next) {
    User.findOne({ _id: req.query.user }, 'friends').then((currentUser) => {
        Post.find({ $or: [{ user: currentUser._id }, { user: { $in: currentUser.friends } }] })
            .populate('user', 'first_name last_name avatar')
            .populate({
                path: 'reactions',
                populate: { path: 'reactor', model: 'User', select: 'first_name last_name' },
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'first_name last_name avatar',
                },
            })
            .sort({ _id: -1 })
            .then((posts) => {
                res.status(200).json(posts);
            })
            .catch((err) => {
                next(err);
            });
    });
};

// Get all posts from a specified user
exports.getUserPosts = function (req, res, next) {
    Post.find({ user: { $eq: req.params.id } })
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: 'first_name last_name avatar',
            },
        })
        .populate('user', 'first_name last_name avatar')
        .populate({
            path: 'reactions',
            populate: { path: 'reactor', model: 'User', select: 'first_name last_name' },
        })
        .sort({ _id: -1 })
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((err) => {
            next(err);
        });
};

exports.putComment = function (req, res, next) {
    const { user_id, content } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors });
    }
    const newComment = new Comment({
        user: user_id,
        content,
        timestamp: dayjs().format('MM/DD/YYYY HH:mm'),
        post: req.params.id,
        edited: false,
    });
    newComment
        .save()
        .then((comment) => {
            Post.findByIdAndUpdate(
                req.params.id,
                { $push: { comments: newComment } },
                { new: true },
            ).then((post) => {
                comment
                    .populate('user', 'first_name last_name avatar')
                    .execPopulate()
                    .then((comment) => {
                        res.status(200).json(comment);
                    });
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.putLike = function (req, res, next) {
    const { reaction, user_id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Reaction is invalid' });
    }
    const newReaction = new Reaction({
        type: reaction,
        reactor: user_id,
    });
    newReaction
        .save()
        .then((savedReaction) => {
            Post.findByIdAndUpdate(
                req.params.id,
                { $push: { reactions: savedReaction } },
                { new: true },
            ).then((updatedPost) => {
                savedReaction
                    .populate('reactor', 'first_name last_name')
                    .execPopulate()
                    .then((reaction) => {
                        res.status(200).json(reaction);
                    });
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getPost = function (req, res, next) {
    Post.findById(req.params.id)
        .populate('user', '-password')
        .populate({
            path: 'reactions',
            populate: { path: 'reactor', model: 'User', select: 'first_name last_name' },
        })
        .populate({
            path: 'comments',
            populate: { path: 'user', model: 'User', select: 'first_name last_name' },
        })
        .then((document) => {
            res.status(200).json(document);
        });
};

exports.postCreatePost = function (req, res, next) {
    const { user_id, content, image } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors });
    }
    const newPost = new Post({
        user: user_id,
        content,
        image,
        timestamp: dayjs().format('HH:mm[,] MM/DD/YYYY'),
    });
    newPost
        .save()
        .then((post) => {
            newPost
                .populate('user', 'first_name last_name avatar')
                .execPopulate()
                .then((populatedPost) => {
                    res.status(200).json({ post, message: 'Post created' });
                });
        })
        .catch((err) => next(err));
};

exports.deletePost = function (req, res, next) {
    Post.findByIdAndDelete(req.params.id)
        .then((deletedPost) => {
            res.status(200).json({ message: 'Post deleted' });
        })
        .catch((err) => {
            next(err);
        });
};

exports.updatePost = function (req, res, next) {
    const { content } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.errors);
    }
    const updatedPost = {
        content,
    };
    Post.findByIdAndUpdate(req.params.id, updatedPost, { new: true }).then((update) => {
        res.status(200).json({ message: 'Post updated', update });
    });
};
