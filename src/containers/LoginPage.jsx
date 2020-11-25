import React from 'react';
import { Redirect } from 'react-router-dom';

import LoginForm from '../components/loginPage/LoginForm';
import SignUpForm from '../components/loginPage/SignUpForm';

import Logo from '../images/ZoomBook.png';

export default function LoginHeader({ authenticated }) {

    return authenticated.message ? (
        <Redirect to={`/users/${authenticated.user_id}/timeline`} />
        ): (
        <>
            <header className="login-page__header">
                <img src={Logo} alt="" />
                <h1>ZoomBook</h1>

                <LoginForm />
            </header>

            <section className="sign-up__container">
                <SignUpForm />
            </section>
        </>
    );
}
