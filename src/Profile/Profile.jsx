import { FaUserCircle } from "react-icons/fa"
import { MdLogout } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5"
import { IoIosChatbubbles } from "react-icons/io"
import { TbHttpDelete } from "react-icons/tb"
import { Link } from 'react-router-dom';
import { useState } from 'react'
import '../index.css'
import './Profile.css'

function Profile() {
        const handleContactClick = (contactId) => {
        history.push(`/usersinfo/${contactId}`);
    };

    return (
        <div className="Profile">
            <Link to="/" className="LogoutButton">
                <button><MdLogout /></button>
            </Link>
            
            <div className="username">
                <FaUserCircle size={60} /> 
                <h1>@username</h1>
            </div>

            <div className="contacts">
                <h2>Contacts:</h2>
                <ul>
                    <li className="contact-card">
                        <h3>Contact 1</h3>
                        <p>Online</p>
                    </li>
                    <li className="contact-card">
                        <h3>Contact 2</h3>
                        <p>Offline</p>
                    </li>
                    <li className="contact-card">
                        <h3>Contact 3</h3>
                        <p>Busy</p>
                    </li>
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