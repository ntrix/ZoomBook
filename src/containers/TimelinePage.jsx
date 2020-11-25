import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import headers from '../services/headers';
import axios from 'axios';

import HeaderNav from './HeaderNav';
import NewsFeed from '../components/newsFeed/NewsFeed';
import PeopleSidebar from '../components/peopleSidebar/PeopleSidebar';
import ContactSidebar from '../components/contactSidebar/ContactSidebar';

export default function TimelinePage({ match, logOut }) {
    const [user, setUser] = useState({});
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios(`/api/users/${match.params.id}`, { headers: headers() });
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        };

        getUser();
    }, [match.params.id]);

    const socket = io.connect('', {
        transports: ['websocket', 'polling', 'flashsocket'],
    });

    useEffect(() => {
        socket.emit('connection', user._id);
        socket.on('connected_users', (usersArr) => {});
        return () => {
            socket.off('connected_users');
        };
    }, [user._id, socket]);

    return (
        <>
            <HeaderNav
                full_name={`${user.first_name} ${user.last_name}`}
                username={user.first_name}
                avatar={user.avatar}
                user_id={user._id}
                friend_requests={user.friend_requests}
                logOut={logOut}
            />

            <div className="container">
                <section className="groups">online users in Video Chat room</section>

                <section className="posts">
                    <NewsFeed currentUser={user} socket={socket} />
                </section>

                <section className="right-col">
                    <ContactSidebar currentUser={user} socket={socket} />

                    <PeopleSidebar currentUser={user} />
                </section>
            </div>
        </>
    );
}
