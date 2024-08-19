import React from 'react';
import { useLocation } from 'react-router-dom';
import './UsersInfo.css';

function UserInfo() {
    const location = useLocation();
    const { contact } = location.state || {};

    if (!contact) {
        return <div>No contact information available.</div>;
    }

    return (
        <div className="UserInfo">
            <a href="/profile"> 👤 Back to profile</a>
            <h2>Name contact: <span className="contact-name">{contact.name}</span></h2>
            
            <div className="info-box">
                <p><strong>📩 JID:</strong> {contact.jid}</p>
            </div>
            <div className="info-box">
                <p><strong>🔒 State:</strong> {contact.state}</p>
            </div>
        </div>
    );
}

export default UserInfo;
