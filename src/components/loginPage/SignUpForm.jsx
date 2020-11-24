import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

export default function SignUpForm() {
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPassword_confirmation] = useState('');
    const [day, setDay] = useState('12');
    const [month, setMonth] = useState('June');
    const [year, setYear] = useState('1995');
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState([]);
    const [btnText, setBtnText] = useState('Sign up');
    const history = useHistory();

    const signUp = async (e) => {
        e.preventDefault();
        const formData = {
            first_name,
            last_name,
            email,
            password,
            password_confirmation,
            day,
            month,
            year,
            gender,
        };
        try {
            const { data } = await axios.post('/api/users/signup', formData, {
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
            });
            if (data.errors) {
                setErrors(data.errors);
            }
            setBtnText('Account created. Logging in...');
            logIn();
        } catch (error) {
            console.error(error);
        }
    };

    const logIn = async () => {
        const formData = {
            email,
            password,
        };
        try {
            const { data } = await axios.post('/api/users/login', formData, {
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
            });
            if (data.token) {
                localStorage.setItem('user', JSON.stringify(data));
                history.push(`/users/${data.user_id}/timeline`);
                window.location.reload();
            } else if (data.message) {
                setErrors(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const days = Array(31).fill(0).map( (_, i) => <option value={++i}>{i}</option> );
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    const years = Array(120).fill(0).map( (_, i) => <option value={ 2020 - i }>{ 2020 - i }</option> );

    return (
        <form className="sign-up-form" onSubmit={(e) => signUp(e)}>
            <h1>Create an account</h1>
            <p>It's quick and easy.</p>

            <div className="names">
                <input
                    type="text"
                    name="first_name"
                    required
                    placeholder="First name"
                    onChange={(e) => setFirst_name(e.target.value)}
                />

                <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="Surname"
                    onChange={(e) => setLast_name(e.target.value)}
                />
            </div>

            <input
                type="email"
                name="email"
                required
                placeholder="Email address *"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                name="password"
                required
                minLength="8"
                placeholder="New password *"
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="password"
                name="password_confirmation"
                required
                minLength="8"
                placeholder="Confirm password *"
                onChange={(e) => setPassword_confirmation(e.target.value)}
            />

            <p className="p-titles">Birthday</p>

            <div className="birthday-selects">
                <select name="day" onChange={(e) => setDay(e.target.value)}>
                    { days }
                </select>
                <select name="month" onChange={(e) => setMonth(e.target.value)}>
                    { months.map( (mon, i) => <option value={++i}>{mon}</option> ) }
                </select>
                <select name="year" onChange={(e) => setYear(e.target.value)}>
                    { years }
                </select>
            </div>

            <p className="p-titles">Gender *</p>

            <div className="gender-choices">
                <div>
                    <input
                        type="radio"
                        name="gender"
                        value="Female"
                        onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="gender">Female</label>
                </div>

                <div>
                    <input
                        type="radio"
                        name="gender"
                        value="Male"
                        onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="gender">Male</label>
                </div>

                <div>
                    <input
                        type="radio"
                        name="gender"
                        value="Other"
                        onChange={(e) => setGender(e.target.value)}
                    />
                    <label htmlFor="gender">Don't tell</label>
                </div>
            </div>

            {errors.length > 0 && (
                <ul className="form-errors">
                    {errors.map((error) => (
                        <li key={error.param}>{error.msg}</li>
                    ))}
                </ul>
            )}

            <button>{btnText}</button>
        </form>
    );
}
