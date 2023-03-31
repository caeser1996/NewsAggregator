import axios from 'axios';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Outernavbar from '../navbar/Navbar';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [registered, setRegistered] = useState(false);

    function onChangeFirstName(e) {
        setFirstName(e.target.value);
    }

    function onChangeLastName(e) {
        setLastName(e.target.value);
    }

    function onChangePhone(e) {
        setPhone(e.target.value);
    }

    function onChangeUserEmail(e) {
        setEmail(e.target.value);
    }

    function onChangePassword(e) {
        setPassword(e.target.value);
    }

    function onChangePasswordConfirmation(e) {
        setPasswordConfirmation(e.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();

        if (firstName.length < 2 || firstName.length > 20) {
            alert('First-name should be between 2-20 charaters');
        }

        if (lastName.length < 2 || lastName.length > 20) {
            alert('Last-name should be between 2-20 charaters');
        }

        if (phone.length < 5 || phone.length > 12) {
            alert('Phone number should be between 5-12 digits');
        }

        if (password.length < 6) {
            alert('Password should be greater then 5 charaters');
        }

        if (password !== passwordConfirmation) {
            alert('Enter same password in both fields');
        }

        const userObject = {
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
            password,
            password_confirmation: passwordConfirmation
        };

        axios
            .post('http://127.0.0.1:8000/api/auth/register', userObject)
            .then(res => {
                console.log(res, 'aaaaaaaaaaa');
                if (res.data.message === 'User successfully registered') {
                    alert('Registration Successful');
                    setRegistered(true);
                }
            })
            .catch(error => {
                if (
                    error.response.data === '{"email":["The email has already been taken."]}'
                ) {
                    alert('The email has already been taken.');
                }
            });

        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
    }

    if (registered) {
        return <Navigate to="/sign-in" />;
    }

    return (
        <div className="container">
            <div className="App">
                <Outernavbar />
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form onSubmit={onSubmit}>
                            <h3>Sign Up</h3>
                            <div>
                                <div className="mb-3">
                                    <label>First name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="First name"
                                        onChange={onChangeFirstName}
                                        name="firstname"
                                        value={firstName}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Last name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Last name"
                                        onChange={onChangeLastName}
                                        name="lastname"
                                        value={lastName}
                                    />
                                </div>
                                <div className="mb-3">

                                    <label>Phone Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter phone number"
                                        onChange={onChangePhone}
                                        name="phone"
                                        value={phone}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                        onChange={onChangeUserEmail}
                                        name="email"
                                        value={email}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        onChange={onChangePassword}
                                        name="password"
                                        value={password}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        onChange={onChangePasswordConfirmation}
                                        name="confirmpassword"
                                        value={passwordConfirmation}
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Sign Up
                                    </button>
                                </div>
                                <p className="forgot-password text-right">
                                    Already registered <a href="/sign-in">sign in?</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}