import React from 'react';

import headers from '../../services/headers';
import axios from 'axios';

import like from '../../images/like.png';
import love from '../../images/love.png';
import hug from '../../images/hug.png';
import haha from '../../images/haha.png';
import wow from '../../images/wow.png';
import sad from '../../images/sad.png';
import angry from '../../images/angry.png';

export default function PostReaction({ post_id, user_id, setPostReactions }) {
    const react = async (type) => {
        const reaction = {
            reaction: type,
            user_id,
        };
        const { data: postReaction } = await axios.put(`/api/posts/${post_id}/react`, reaction,  {
            mode: 'cors',
            headers: headers(),
        });
        setPostReactions((postReactions) => postReactions.concat(postReaction));
    };

    const reactions = [
        { type: 'Like', img: like},
        { type: 'Love', img: love},
        { type: 'Hug', img: hug},
        { type: 'Haha', img: haha},
        { type: 'Wow', img: wow},
        { type: 'Sad', img: sad},
        { type: 'Angry', img: angry},
    ];
    return (
        <div className="box">
            {reactions.map(r =>
                <button className="reaction-like" onClick={() => react(r.type)}>
                    <img src={r.img} alt={r.type} />
                    <span className="legend-reaction">{r.type}</span>
                </button>
            )}
        </div>
    );
}
