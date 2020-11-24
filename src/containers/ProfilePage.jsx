import React, { useState, useEffect } from 'react';

import headers from 'services/headers';
import axios from 'axios';

import HeaderNav from './HeaderNav';
import ProfileBanner from '../components/profilePage/ProfileBanner';
import UserPosts from '../components/profilePage/UserPosts';
import Friends from '../components/profilePage/Friends';

export default function ProfilePage({ match, currentUser, logOut }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            const { data } = await axios(`/api/users/${match.params.id}`, {
                mode: 'cors',
                headers: headers(),
            });
            setUser(data);
        };
        getUser();
    }, [match.params.id]);

    return (
        <>
            <HeaderNav
                username={currentUser.first_name}
                full_name={`${currentUser.first_name} ${currentUser.last_name}`}
                user_id={currentUser._id}
                avatar={currentUser.avatar}
                friend_requests={user.friend_requests}
                logOut={logOut}
            />

            <section className="profile">
                <ProfileBanner
                    first_name={user.first_name || ''}
                    last_name={user.last_name || ''}
                    bio={user.bio}
                    cover_photo={user.cover_photo}
                    avatar={user.avatar}
                    notLoggedInUser={match.params.id}
                    currentUser={currentUser._id}
                    friends={currentUser.friends}
                    friend_requests={currentUser.friend_requests}
                />

                <div className="cols-wrapper">
                    <Friends friends={user.friends} />
                    <UserPosts
                        currentUser={currentUser}
                        profile_user_id={user._id}
                        avatar={user.avatar}
                    />
                </div>
            </section>
        </>
    );
}
