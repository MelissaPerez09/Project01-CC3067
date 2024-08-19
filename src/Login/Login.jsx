import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import plainLogo from '../assets/logo.png'
import '../index.css'
import './Login.css'
import connectXMPP from '../backend/connect'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const xmpp = connectXMPP(username, password);

    xmpp.on('online', () => {
        console.log('Connected successfully');
        navigate('/profile', { state: { username: username } }); 
    });

    xmpp.on('stanza', (msg) => {
        console.log('Message received:', msg);
        // Handle incoming messages here
    });

    if (xmpp.status !== 'online' && xmpp.status !== 'connecting') {
        xmpp.start().catch((err) => {
            console.error('Failed to connect:', err);
        });
    }
  };

  return (
    <div className="Login">
      <img src={plainLogo} alt="logo" />
      <h1>Welcome to ChatFlow!</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p className="signin">Don't have an account?<a href="/signup">Sign up</a></p>
    </div>
  );
}

export default Login;
