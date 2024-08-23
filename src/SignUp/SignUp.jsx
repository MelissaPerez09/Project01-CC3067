/*
    SignUp.jsx
    Manages the sign-up page, including creating a new account.
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import plainLogo from '../assets/logo1.png';
import '../index.css';
import './SignUp.css';
import registerNewUser from '../backend/register';

function SignUp() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Handle submitting the sign-up form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Usages existing password and username to create a new account
        // This is for authentication purposes
        const existingUsername = 'per21385';
        const existingPassword = '12345';

        registerNewUser(
            existingUsername,
            existingPassword,
            username,
            password,
            fullname,
            () => {
                console.log('Account created successfully');
                navigate('/');
            },
            (err) => {
                console.error('Failed to register account:', err);
                alert('Registration failed. Please try again.');
            }
        );
    };

    return (
        <div className="SignUp">
            <img src={plainLogo} alt="logo" />
            <h1>Create an Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullname">Full name:</label>
                    <input
                        type="text"
                        id="fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <p className="signin">Already have an account?<a href="/">Log in</a></p>
        </div>
    );
}

export default SignUp;
