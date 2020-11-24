import React from 'react';
import defaultAvatar from 'images/defaultAvatar.png';
import { Link } from 'react-router-dom';

export default function SearchResult({ currentUser, location }) {
    const people = location.state.searchResult;
    const friendsID = currentUser.friends && currentUser.friends.map((friend) => friend._id);

    return (
        <>
            <section className="search-people">
                <h2>Search results</h2>
                {people.length > 0 ? (
                    people.map((person) => (
                        <figure key={person._id}>
                            <Link to={`/users/${person._id}/profile`}>
                                <img src={person.avatar || defaultAvatar} alt="" />
                                <figcaption>{`${person.first_name} ${person.last_name}`}</figcaption>
                            </Link>

                            {friendsID && friendsID.includes(person._id) ? (
                                <div className="action">Friend</div>
                            ) : (
                                <Link to={`/users/${person._id}/profile`}>
                                    <div className="action">
                                        {person._id === currentUser._id ? ' You ' : 'See profile'}
                                    </div>
                                </Link>
                            )}
                        </figure>
                    ))
                ) : (
                    <p>User not found! Try again with another filter?</p>
                )}
            </section>
        </>
    );
}
