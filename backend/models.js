const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: { day: String, month: String, year: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    cover_photo: String,
    avatar: String,
    bio: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friend_requests: [{ type: Schema.Types.ObjectId, ref: 'FriendRequest' }],
    joined_on: String,
});

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    image: String,
    timestamp: { type: String, required: true },
    reactions: [{ type: Schema.Types.ObjectId, ref: 'Reaction' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const ReactionSchema = new Schema({
    type: { type: String, enum: ['Like', 'Love', 'Hug', 'Haha', 'Wow', 'Sad', 'Angry'] },
    reactor: { type: Schema.Types.ObjectId, ref: 'User' },
});

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    edited: Boolean,
});

const FriendRequestSchema = new Schema({
    status: { type: String, enum: ['Accepted', 'Pending', 'Declined'] },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: String,
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Reaction = mongoose.model('Reaction', ReactionSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = { User, Post, Reaction, Comment, FriendRequest }
