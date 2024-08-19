import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import './Users.css';
import addContact from '../backend/addUser';

function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [users, setUsers] = useState(['username1', 'username2', 'username3', 'username4']);
    const navigate = useNavigate();

    const filteredUsers = users.filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddContact = () => {
        if (email) {
            addContact(email, name, 
                () => {
                    console.log("Contact added successfully!");
                    // Optionally, navigate back to profile or show a success message
                    navigate('/profile');
                },
                (error) => {
                    console.error("Failed to add contact:", error);
                }
            );
        } else {
            console.error("Email (JID) is required to add a contact");
        }
    };

    return (
        <div className="add-contacts-container">
            <a href="/profile"> 👤 Back to profile</a>
            <h2>Add contact</h2>
            <div className="manual-add">
                <input 
                    type="text" 
                    placeholder="Enter email (JID)" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Enter name (optional)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="add-button" onClick={handleAddContact}>Add Contact</button>
            </div>
        </div>      
    );
}

export default Users;