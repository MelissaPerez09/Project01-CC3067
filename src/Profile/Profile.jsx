import { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { IoPersonAdd } from "react-icons/io5"
import { IoIosChatbubbles } from "react-icons/io"
import { TbHttpDelete } from "react-icons/tb"
import { Link, useLocation } from 'react-router-dom'
import getRoster from '../backend/getRoster'
import '../index.css'
import './Profile.css'

function Profile() {
    const location = useLocation();
    const username = location.state?.username || 'Guest';
    const password = location.state?.password || ''; // Get password if needed
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (username !== 'Guest') {
            getRoster(username, password, (roster) => {
                setContacts(roster);
            }, (error) => {
                console.error('Failed to fetch roster:', error);
            });
        }
    }, [username, password]);

    const handleContactClick = (contactId) => {
        // Navigate to contact details
    };

    return (
        <div className="Profile">
            <Link to="/" className="LogoutButton">
                <button><MdLogout /></button>
            </Link>
            
            <div className="username">
                <FaUserCircle size={60} /> 
                <h1>{username}</h1>
            </div>

            <div className="contacts">
                <h2>Contacts:</h2>
                <ul>
                    {contacts.map((contact, index) => (
                        <li key={index} className="contact-card" onClick={() => handleContactClick(contact.jid)}>
                            <h3>{contact.name}</h3>
                            <p>{contact.subscription}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="Menu">
                <div className="MenuItem">
                    <Link to="/users">
                        <button className="MenuButton" title="Add Contact"><IoPersonAdd /></button>
                    </Link>
                </div>
                <div className="MenuItem">
                    <Link to="/chat-room">
                        <button className="MenuButton" title="Chat Room"><IoIosChatbubbles /></button>
                    </Link>
                </div>
                <div className="MenuItem">
                    <Link to="/delete-account">
                        <button className="MenuButton" title="Delete Account"><TbHttpDelete /></button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Profile;