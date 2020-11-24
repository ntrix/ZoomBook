import React from 'react';

import HeaderNav from './HeaderNav';
import SearchResult from 'components/searchPage/SearchResult';

export default function SearchPage({ currentUser, logOut, location }) {

    return (
        <>
            <HeaderNav
                username={currentUser.first_name}
                avatar={currentUser.avatar}
                user_id={currentUser._id}
                full_name={`${currentUser.first_name} ${currentUser.last_name}`}
                friend_requests={currentUser.friend_requests}
                logOut={logOut}
            />

            <SearchResult
                currentUser={currentUser}
                location={location}
            />
        </>
    );
}
