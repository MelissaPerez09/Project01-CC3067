import { useState } from 'react'
import plainLogo from '../assets/logo.png'
import '../index.css'
import './Login.css'
import { connect } from '../backend/xmpp'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const jid = `${username}@alumchat.lol`;
    
    connect(jid, password, () => {
      console.log('Connected successfully');
      navigate('/profile');
    }, (msg) => {
      console.log('Message received:', msg);
    });
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
        <button type="submit" onClick={handleSubmit}>Login</button>
      </form>
      <p className="signin">Don't have an account?<a href="/signup">Sign up</a></p>
    </div>
  );
}

export default Login;
