import React, { useState } from 'react';

import headers from '../../services/headers';
import axios from 'axios';

export default function Notifications({ friend_requests, pendingFrs }) {
    const [showResult, setShowResult] = useState(false);
    const [resultText, setResultText] = useState('');

    const processRequest = async (fromUserID, toUserID, acceptOrDecline, resultText) => {
        try {
            const { status } = await axios.put(
                `/api/users/friend-request/${fromUserID}/${acceptOrDecline}/${toUserID}`,
                { mode: 'cors', headers: headers() },
            );
            if (status === 200) {
                setShowResult(true);
                setResultText(resultText);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className='notifications-modal'>
            <h3>Notifications</h3>

            {friend_requests && pendingFrs.map((fr) => (
                <article key={fr._id}>
                    <figure>
                        <img src={fr.from.avatar} alt="" />
                        <figcaption>
                            <strong>{`${fr.from.first_name} ${fr.from.last_name}`}</strong> has
                            sent you a friend request.
                        </figcaption>
                    </figure>

                    <div className={showResult ? 'hide' : ''}>
                        <button
                            className="accept-fr"
                            type="button"
                            onClick={() =>
                                processRequest(
                                    fr.from._id,
                                    fr.to._id,
                                    'accept',
                                    'Request accepted',
                                )
                            }
                        >
                            Accept
                        </button>

                        <button
                            className="decline-fr"
                            type="button"
                            onClick={() =>
                                processRequest(
                                    fr.from._id,
                                    fr.to._id,
                                    'decline',
                                    'Request declined',
                                )
                            }
                        >
                            Decline
                        </button>
                    </div>

                    <div className={showResult ? 'active' : 'hide'}>{resultText}</div>
                </article>
            ))}
            {pendingFrs.length === 0 && <p>There are no new notifications.</p>}
        </div>
    );
}
