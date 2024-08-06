import { useState } from 'react'
import plainLogo from '../assets/logo1.png'
import '../index.css'
import './SignUp.css'

function SignUp() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signing up with Fullname:', fullname);
        console.log('Signing up with Username:', username);
        console.log('Password:', password);
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
                value={username}
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