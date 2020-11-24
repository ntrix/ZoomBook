import React, { useState, useRef } from 'react';

import defaultAvatar from 'images/defaultAvatar.png';
import ChatWindow from './ChatWindow';

export default function ContactList({ friend, socket, currentUserID }) {
    const [showChatWindow, setShowChatWindow] = useState(false);
    const inputRef = useRef();
    const openChat = () => {
        setShowChatWindow(!showChatWindow);
        if (!showChatWindow) {
            inputRef.current.focus();
            inputRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div className="info-chat-wrapper">
            <figure key={friend._id} onClick={() => openChat()}>
                <img src={friend.avatar || defaultAvatar} alt="" />
                <figcaption>{`${friend.first_name} ${friend.last_name}`}</figcaption>
            </figure>

            <ChatWindow
                friend={friend}
                setShowChatWindow={setShowChatWindow}
                showChatWindow={showChatWindow}
                inputRef={inputRef}
                socket={socket}
                currentUserID={currentUserID}
            />
        </div>
    );
}
