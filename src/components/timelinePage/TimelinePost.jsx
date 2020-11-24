import React, { useState, useRef } from 'react';

import { Link } from 'react-router-dom';
import moment from 'moment';
import EditNewsForm from '../newsFeed/EditNewsForm';
import PostComment from './PostComment';
import PostReaction from './PostReaction';
import headers from 'services/headers';
import axios from 'axios';

import defaultAvatar from 'images/defaultAvatar.png';

import edit from 'images/edit.png';
import deleteIcon from 'images/delete.png';

import like from 'images/like.png';
import love from 'images/love.png';
import hug from 'images/hug.png';
import haha from 'images/haha.png';
import wow from 'images/wow.png';
import sad from 'images/sad.png';
import angry from 'images/angry.png';

export default function TimelinePost({
    post_id,
    user,
    user_id,
    avatar,
    content,
    image,
    comments,
    reactions,
    timestamp,
    currentUser,
    deletePost,
}) {
    const [postContent, setPostContent] = useState(content || '');
    const [postComments, setPostComments] = useState(comments);
    const [commentsCount, setCommentCount] = useState(comments.length || 0);
    const [comment, setComment] = useState('');
    const [postReactions, setPostReactions] = useState(reactions);
    const [showPostActions, setShowPostActions] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const currentUserID = currentUser._id;

    const createComment = async (e) => {
        e.preventDefault();
        const newComment = {
            content: comment,
            user_id: currentUser._id,
        };
        const { data } = await axios.put(`/api/posts/${post_id}/comment`, newComment, {
            mode: 'cors',
            headers: headers(),
        });
        setComment('');
        setPostComments((comments) => comments.concat(data));
        setCommentCount(postComments.length + 1);
        console.log(data);
    };

    const reactionFilter = type => postReactions.filter((reaction) => reaction.type === type).length;
    const reactionCounts = [
        { type: reactionFilter('Like'), img: like, key: 1 },
        { type: reactionFilter('Love'), img: love, key: 2 },
        { type: reactionFilter('Hug'), img: hug, key: 3 },
        { type: reactionFilter('Haha'), img: haha, key: 4 },
        { type: reactionFilter('Wow'), img: wow, key: 5 },
        { type: reactionFilter('Sad'), img: sad, key: 6 },
        { type: reactionFilter('Angry'), img: angry, key: 7 },
    ];

    const sortedReactionCounts = reactionCounts.sort((a, b) => b.type - a.type);

    const commentInput = useRef();
    const focusCommentInput = () => {
        commentInput.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        commentInput.current.focus();
    };

    return (
        <article>
            {currentUserID === user_id ? (
                <div className="post-actions" onClick={() => setShowPostActions(!showPostActions)}>
                    &sdot;&sdot;&sdot;
                    {showPostActions && (
                        <div className="btn-wrapper">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm(!showEditForm)}
                                >
                                    <img src={edit} alt=" " />
                                    Edit
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={(e) => deletePost(post_id, setShowPostActions)}
                                >
                                    <img src={deleteIcon} alt="" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                ''
            )}

            <Link to={`/users/${user_id}/profile`}>
                <figure className="user-info">
                    <img src={avatar || defaultAvatar} alt="" />

                    <figcaption>
                        <p className="username">{user}</p>
                        <p className="post-date">
                            {moment(new Date(timestamp.split(', ').reverse().join(' '))).fromNow()}
                        </p>
                    </figcaption>
                </figure>
            </Link>

            {currentUserID === user_id && (
                <EditNewsForm
                    oldContent={content}
                    showEditForm={showEditForm}
                    setShowEditForm={setShowEditForm}
                    post_id={post_id}
                    setPostContent={setPostContent}
                />
            )}

            <figure className="post-content" onClick={() => setShowPostActions(false)}>
                {!showEditForm && <figcaption>{postContent}</figcaption>}
                <img src={image || ''} alt="" className="post-img" />
            </figure>

            <div className="reactions-comment-count">
                <ul className="reactions">
                    {sortedReactionCounts.map(
                        (reaction) =>
                            !!reaction.type && (
                                <li key={reaction.key}>
                                    <img src={reaction.img} alt="" />
                                    <span className="reaction-counter">{reaction.type}</span>
                                </li>
                            ),
                    )}
                    <li>{postReactions.length > 0 ? postReactions.length : ''}</li>
                </ul>

                <p className="comment-count">
                    {commentsCount === 1 ? `${commentsCount} comment` : `${commentsCount} comments`}
                </p>
            </div>

            <div className="like-comment-buttons">
                <div className="like" id="like-btn">
                    <PostReaction
                        post_id={post_id}
                        user_id={currentUser._id}
                        setPostReactions={setPostReactions}
                    />
                    <i> </i>Like
                </div>

                <button className="comment" onClick={focusCommentInput}>
                    <i> </i>Comment
                </button>
            </div>

            <PostComment comments={postComments} />

            <form onSubmit={(e) => createComment(e)}>
                <img src={currentUser.avatar || defaultAvatar} alt="" />

                <input
                    type="text"
                    required
                    placeholder="Write a comment..."
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    ref={commentInput}
                />

                <button>Comment</button>
            </form>
        </article>
    );
}
