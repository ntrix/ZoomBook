import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import SearchBox from '../components/searchPage/SearchBox';
import AccountSetting from '../components/headerNav/AccountSetting';
import Notifications from '../components/headerNav/Notifications';

import Logo from '../images/ZoomBook.png';
import defaultAvatar from '../images/defaultAvatar.png';
import edit from '../images/edit.png';

export default function HeaderNav({
    username,
    avatar,
    user_id,
    full_name,
    friend_requests,
    logOut,
}) {
    const [showAccountSettings, setShowAccountSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const pendingFrs = friend_requests
        ? friend_requests.filter((fr) => fr.status === 'Pending' && fr.to._id === user_id)
        : [];
    const switchNotifyModalState = () => {
        setShowNotifications(!showNotifications);
        setShowAccountSettings(false);
    };

    const switchAccModalState = () => {
        setShowAccountSettings(!showAccountSettings);
        setShowNotifications(false);
    };

    const frRequestNumber = pendingFrs.length;

    return (
        <header className="home-header">
            <img src={Logo} alt="" />

            <SearchBox user_id={user_id} />
            <p style={{ flex: 1 }}></p>

            <ul>
                <Link to={`/users/${user_id}/profile`}>
                    <li><img src={avatar || defaultAvatar} alt="" /></li>
                    <li>Hi {username}!</li>
                </Link>

                <li>
                    <Link to={`/users/${user_id}/timeline`}>
                        <img src={edit} alt="" />
                    </Link>
                </li>

                <li className="notifications" onClick={switchNotifyModalState}>
                    <i></i>
                    <span>Notifications</span>
                    <span className={frRequestNumber > 0 ? 'fr-number active' : 'fr-number'}>
                        {frRequestNumber > 0 ? frRequestNumber : ''}
                    </span>
                </li>

                <li className="account" onClick={switchAccModalState}>
                    <i></i>
                    <span>Account</span>
                </li>
            </ul>

            {showAccountSettings && <div className="modal-shadow" onClick={switchAccModalState} />}
            {showAccountSettings && <AccountSetting
                name={full_name}
                avatar={avatar || defaultAvatar}
                user_id={user_id}
                logOut={logOut}
            />}

            {showNotifications && <div className="modal-shadow" onClick={switchNotifyModalState} />}
            {showNotifications && <Notifications friend_requests={friend_requests} pendingFrs={pendingFrs}/>}
        </header>
    );
}
