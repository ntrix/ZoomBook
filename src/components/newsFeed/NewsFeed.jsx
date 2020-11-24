import React, { useState, useEffect } from 'react';
import TimelinePost from '../timelinePage/TimelinePost';
import CreateNews from './CreateNews';
import LoadingSpin from '../common/LoadingSpin';
import headers from 'services/headers';
import axios from 'axios';

export default function NewsFeed({ currentUser, socket }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, showLoading] = useState(true);
    const friends = currentUser.friends && currentUser.friends.map((friend) => friend._id);

    useEffect(() => {
        const abortCon = new AbortController();
        const signal = abortCon.signal;
        const getPosts = async () => {
            const { data } = await axios(`/api/posts?user=${currentUser._id}`, {
                headers: headers(),
                signal,
            });
            setPosts(data);
            showLoading(!isLoading);
            socket.on('new_post', (post) => {
                if (post.user._id !== currentUser._id && friends.includes(post.user._id)) {
                    setPosts((posts) => [post, ...posts]);
                }
            });
        };
        if (currentUser._id) {
            getPosts();
        }
        return function () {
            abortCon.abort();
            socket.off('new_post');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser._id]);

    const deletePost = async (post_id, setShowPostActions) => {
        await axios.delete(`/api/posts/${post_id}`, { mode: 'cors', headers: headers() });
        setPosts((prevState) => prevState.filter((post) => post._id !== post_id));
        setShowPostActions(false);
    };

    return (
        <>
            <CreateNews
                username={currentUser.first_name}
                avatar={currentUser.avatar}
                user_id={currentUser._id}
                setPosts={setPosts}
                socket={socket}
            />

            <LoadingSpin isLoading={isLoading} />

            <section className="post-list">
                {posts.map((post) => (
                    <TimelinePost
                        key={post._id}
                        post_id={post._id}
                        user={`${post.user.first_name} ${post.user.last_name}`}
                        user_id={post.user._id}
                        avatar={post.user.avatar}
                        content={post.content}
                        image={post.image}
                        comments={post.comments}
                        reactions={post.reactions}
                        timestamp={post.timestamp}
                        currentUser={currentUser}
                        deletePost={deletePost}
                    />
                ))}
            </section>
        </>
    );
}
