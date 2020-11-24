import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function AuthRoute({ render: Component, ...props }) {
    const [authenticated, setAuthenticated] = useState(0);

    useEffect(() => {
        setAuthenticated(localStorage.getItem('user')? 1: 2);
    }, []);

    return authenticated? (
        <Route
            {...props}
            render={(props) =>
                authenticated === 1
                    ? <Component {...props} />
                    : <Redirect to={'/users/login'} />
            }
        />
    ): <></>;
}
