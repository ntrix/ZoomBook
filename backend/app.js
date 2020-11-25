require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const socket = require('socket.io');

require('./db');
const { User } = require('./models');

const indexRoute = require('./routes/indexRoute');
const usersRoute = require('./routes/usersRoute');

const app = express();

const io = socket();
app.io = io;

let users = [];

io.on('connection', (socket) => {
    socket.on('connection', (currentUserID) => {
        users = users.filter((user) => user.currentUserID !== null);
        const isConnected = users.find((user) => user.currentUserID === currentUserID);
        if (!isConnected) {
            users.push({ socket, currentUserID });
        }
    });

    socket.on('send_message', (data) => {
        const toUser = users.find((u) => u.currentUserID === data.to);
        const fromUser = users.find((u) => u.currentUserID === data.from);
        if (toUser) {
            socket.broadcast.to(toUser.socket.id).emit('new_message', {
                id: data.to,
                message: data.message,
                chatIdentifier: data.chatIdentifier,
            });
            socket.broadcast.to(fromUser.socket.id).emit('new_message', {
                id: data.to,
                message: data.message,
                chatIdentifier: data.chatIdentifier,
            });
        } else if (!toUser) {
            socket.broadcast.to(fromUser.socket.id).emit('new_message', {
                id: data.to,
                message: 'User is not connected at the moment.',
                chatIdentifier: data.chatIdentifier,
            });
        }
    });

    socket.on('new_post', (post) => {
        socket.broadcast.emit('new_post', post);
    });

    socket.on('disconnect', () => {
        const user = users.find((user) => user.socket.id === socket.id);
        if (user) {
            users.splice(users.indexOf(user), 1);
        }
    });
});

passport.use(
    new Strategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        function (payload, done) {
            User.findOne({ email: payload.email }, (err, user) => {
                return err? done(err): done(null, user || false);
            });
        },
    ),
);

app.use(cors());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
app.use(cookieParser());

app.use('/api/posts', indexRoute);
app.use('/api/users', usersRoute);

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build'));
});

module.exports = app;
