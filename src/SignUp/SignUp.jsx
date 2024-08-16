import { useState } from 'react';
import plainLogo from '../assets/logo1.png';
import '../index.css';
import './SignUp.css';
import registerXMPP from '../backend/register';

function SignUp() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const jid = `${username}@alumchat.lol`;

        console.log('Full name:', fullname);
        console.log('Username:', username);
        console.log('Password:', password);

        // Llamar a la función de registro
        registerXMPP(username, password, fullname, () => {
            console.log('Account created and connected successfully');
            // Aquí podrías redirigir al usuario a la página de perfil
            // navigate('/profile');
        }, (err) => {
            console.error('Failed to register account:', err);
        });
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
