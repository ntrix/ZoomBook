/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';

import logOutIcon from '../../images/logOut.png';
import videoChat from '../../images/videoChat.png';

export default function AccountSetting({ name, user_id, avatar, logOut }) {
    return (
        <div className='account-modal active'>
            <Link to=''>
                <figure>
                    <img src={videoChat} alt="" />
                    <figcaption>
                        <p>{name}</p>
                        <p>Create video room</p>
                    </figcaption>
                </figure>
            </Link>

            <div className="border"></div>

            <Link to={`/users/${user_id}/profile`}>
                <div className="option">
                    <img src={avatar} alt="" />
                    <p>Profile / Setting</p>
                </div>
            </Link>

            <Link to="/users/login">
                <button className="option" onClick={logOut}>
                    <img src={logOutIcon} alt="" />
                    <p>Log out</p>
                </button>
            </Link>
        </div>
    );
}
