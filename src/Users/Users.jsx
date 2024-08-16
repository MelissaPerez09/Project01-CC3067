import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import './Users.css';
import connectXMPP from '../backend/connect';

function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const users = ['username1', 'username2', 'username3', 'username4'];

    const filteredUsers = users.filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="add-contacts-container">
            <a href="/profile"> 👤 Back to profile</a>
            <h2>More Users</h2>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">🔍</button>
            </div>
            <div className="user-grid">
                {filteredUsers.map((user, index) => (
                    <div key={index} className="user-card">
                        <p>{user}</p>
                        <button className="add-button">Add</button>
                    </div>
                ))}
            </div>
        </div>      
    );
}

export default Users;