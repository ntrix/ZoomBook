import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import headers from '../../services/headers';
import axios from 'axios';

import defaultAvatar from '../../images/defaultAvatar.png';

export default function Person({
    current_user_id,
    first_name,
    last_name,
    avatar,
    person_id,
    btnText,
}) {
    const [requestStatus, setRequestStatus] = useState('');

    const sendFriendRequest = async () => {
        const { data } = await axios.post(
            `/api/users/friend-request/${current_user_id}/send/${person_id}`, {
                mode: 'cors',
                headers: headers(),
            },
        );
        setRequestStatus(data.message);
    };

    return (
        <article>
            <Link to={`/users/${person_id}/profile`}>
                <img src={avatar || defaultAvatar} alt="" />
            </Link>

            <div>
                <Link to={`/users/${person_id}/profile`}>
                    <p>{`${first_name} ${last_name}`}</p>
                </Link>

                <button type="button" onClick={sendFriendRequest}>
                    {requestStatus || btnText}
                </button>
            </div>
        </article>
    );
}
