import React from 'react';

export default function LoadingSpin({ isLoading }) {
    return (isLoading &&
        <div className="loader">
            <div className="loading">
                { [0, 1, 2, 3, 4, 5, 6].map( _ => <div className="loading__square"></div>) }
            </div>
        </div>
    );
}
