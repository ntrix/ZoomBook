import React from 'react';
import defaultAvatar from 'images/defaultAvatar.png';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function PostComment({ comments }) {
    return (
        <div className="comments">
            {comments.map((comment) => (
                <figure key={comment._id}>
                    <Link to={`/users/${comment.user._id}/profile`}>
                        <img src={comment.user.avatar || defaultAvatar} alt="" />
                    </Link>

                    <figcaption>
                        <Link to={`/users/${comment.user._id}/profile`}>
                            <p className="username">{`${comment.user.first_name} ${comment.user.last_name}`}</p>
                        </Link>

                        <p className="content">{comment.content}</p>
                    </figcaption>

                    <p className="timestamp">{moment(new Date(comment.timestamp)).fromNow()}</p>
                </figure>
            ))}
        </div>
    );
}
