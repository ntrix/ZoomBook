import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import headers from '../../services/headers';
import axios from 'axios';

import SearchIcon from '../../images/search.png';

export default function SearchBox({user_id}) {
    const [showIcon, setShowIcon] = useState(1);
    const [searchPeopleQuery, setSearchPeopleQuery] = useState('');
    const history = useHistory();

    const searchPeople = async (e) => {
        e.preventDefault();
        try {
            const { data, status } = await axios(
                `/api/users/${user_id}/search?limit=50&search=${searchPeopleQuery}`,
                { mode: 'cors', headers: headers() },
            );
            const searchResult = data;
            if (status === 200) {
                history.push(`/users/${user_id}/search?q=${searchPeopleQuery}`, { searchResult });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <form onSubmit={(e) => searchPeople(e)}>
            <div className="search-box">
                <input
                    type="search"
                    placeholder="Search"
                    onChange={ e => setSearchPeopleQuery(e.target.value)}
                    onFocus={ _ => setShowIcon(0)}
                    onBlur={ _ => setShowIcon(1)}
                />

                <img src={SearchIcon} alt="" style={{opacity: showIcon, transition: 'all 0.5s ease'}} />
            </div>
        </form>
    )
}