const { User, FriendRequest } = require('../models');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { response } = require('express');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
});

exports.getUser = function (req, res, next) {
    User.findById(req.params.id, '-password')
        .populate('posts')
        .populate({
            path: 'friend_requests',
            populate: {
                path: 'from',
                model: 'User',
                select: 'first_name last_name avatar',
            },
        })
        .populate({
            path: 'friend_requests',
            populate: {
                path: 'to',
                model: 'User',
                select: 'first_name last_name avatar',
            },
        })
        .populate('friends', 'first_name last_name avatar')
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            next(err);
        });
};

exports.getNewUsers = function (req, res, next) {
    const search = req.query.search || '';
    User.findOne({ _id: req.params.id }).then((user) => {
        FriendRequest.find({ $or: [{ from: user._id }, { to: user._id }] }).then((fr) => {
            User.find(
                {
                    _id: { $nin: user.friends, $ne: user._id },
                    friend_requests: { $nin: fr },
                    $or: [
                        { first_name: new RegExp(search, 'i') },
                        { last_name: new RegExp(search, 'i') },
                    ],
                },
                'first_name last_name avatar',
            )
                .limit(Number(req.query.limit))
                .populate({
                    path: 'friend_requests',
                    populate: {
                        path: 'from',
                        model: 'User',
                        select: 'first_name last_name avatar',
                    },
                })
                .populate({
                    path: 'friend_requests',
                    populate: {
                        path: 'to',
                        model: 'User',
                        select: 'first_name last_name avatar',
                    },
                })
                .then((people) => {
                    res.status(200).json(people);
                })
                .catch((error) => {
                    next(error);
                });
        });
    });
};

exports.searchUsers = function (req, res, next) {
    const search = req.query.search || '';
    User.findOne({ _id: req.params.id }).then((user) => {
        FriendRequest.find({ $or: [{ from: user._id }, { to: user._id }] }).then((fr) => {
            User.find(
                {
                    $or: [
                        { first_name: new RegExp(search, 'i') },
                        { last_name: new RegExp(search, 'i') },
                    ],
                },
                'first_name last_name avatar',
            )
                .limit(Number(req.query.limit))
                .populate({
                    path: 'friend_requests',
                    populate: {
                        path: 'from',
                        model: 'User',
                        select: 'first_name last_name avatar',
                    },
                })
                .populate({
                    path: 'friend_requests',
                    populate: {
                        path: 'to',
                        model: 'User',
                        select: 'first_name last_name avatar',
                    },
                })
                .then((people) => {
                    res.status(200).json(people);
                })
                .catch((error) => {
                    next(error);
                });
        });
    });
};

exports.putUserUpdate = function (req, res, next) {
    const { first_name, last_name, cover_photo, avatar, bio } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.errors);
    }

    (async () => {
        const updatedUser = {
            first_name,
            last_name,
            bio,
        };
        if (cover_photo) await cloudinary.uploader.upload(cover_photo, {}, (err, data) => updatedUser.cover_photo = data.url);
        if (avatar) await cloudinary.uploader.upload(avatar, {}, (err, data) => updatedUser.avatar = data.url);
/* TODO get user from DB and compare before update */
        User.findByIdAndUpdate(req.params.id, updatedUser, { new: true })
        .then( _ => res.status(200).json({ message: 'Your profile has been updated' }) )
        .catch( err => { res.status(200).json({ message: 'no profile update' }); next(err)} );
    }) ();
};

exports.login = function (req, res, next) {
    const { password, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.errors });
    }
    User.findOne({ email })
        .then((user) => {
            if (!user) return res.status(401).json({ message: 'User not found' });
            bcrypt.compare(password, user.password, (err, success) => {
                if (err) return next(err);
                if (success) {
                    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
                        expiresIn: 3600 * 24 * 7,
                    });
                    return res.status(200).json({
                        token,
                        message: 'User authenticated',
                        user_id: user._id,
                    });
                } else {
                    return res.status(400).json({ message: 'Incorrect password' });
                }
            });
        })
        .catch((err) => {
            next(err);
        });
};

exports.signup = function (req, res, next) {
    const { first_name, last_name, password, email, day, month, year, gender } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.errors });
        return;
    }

    User.findOne({ email })
        .then((document) => {
            if (document) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) return next(err);

                const user = new User({
                    first_name,
                    last_name,
                    password: hashedPassword,
                    email,
                    birthday: { day, month, year },
                    gender,
                    joined_on: dayjs().format('MM Do YYYY'),
                });
                user.save().then((document) => {
                    res.json({ message: 'Account created.' });
                });
            });
        })
        .catch((err) => {
            next(err);
        });
};
