import React, { useState, useRef } from 'react';

import headers from '../../services/headers';
import axios from 'axios';

export default function AddFriendBtn({
    notLoggedInUser,
    currentUser,
    friends,
    friend_requests,
}) {
    const [addFriendBtnText, setAddFriendBtnText] = useState('Add friend');

    const isCurrentUserFriend = friends && friends.some((friend) => friend._id === notLoggedInUser);

    const hasSentRequest =
        friend_requests && friend_requests.some((fr) => fr.to._id === notLoggedInUser);

    const addFriendRef = useRef();

    const sendFriendRequest = async () => {
        try {
            const { data, status } = await axios.post(
                `/api/users/friend-request/${currentUser}/send/${notLoggedInUser}`,
                { mode: 'cors', headers: headers() },
            );
            if (status === 200) {
                addFriendRef.current.disabled = true;
                setAddFriendBtnText(data.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            {!isCurrentUserFriend &&
                notLoggedInUser !== currentUser &&
                !hasSentRequest && hasSentRequest !== undefined && (
                <button
                    className="add-friend"
                    type="button"
                    onClick={sendFriendRequest}
                    ref={addFriendRef}
                >
                    {addFriendBtnText}
                </button>
            )}
        </>
    )
}