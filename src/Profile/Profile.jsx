import { FaUserCircle } from "react-icons/fa"
import { MdLogout } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5"
import { IoIosChatbubbles } from "react-icons/io"
import { TbHttpDelete } from "react-icons/tb"
import { useState } from 'react'
import '../index.css'
import './Profile.css'

function Profile() {

    return (
        <div className="Profile">
            <button className="LogoutButton"><MdLogout /></button>
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
                    <button className="MenuButton" title="Add Contact"><IoPersonAdd /></button>
                </div>
                <div className="MenuItem">
                    <button className="MenuButton" title="Chat Room"><IoIosChatbubbles /></button>
                </div>
                <div className="MenuItem">
                    <button className="MenuButton" title="Delete Account"><TbHttpDelete /></button>
                </div>
            </div>
        </div>
    );
}

export default Profile;