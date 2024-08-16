import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UsersInfo.css';

function UserInfo() {
    const { contactId } = useParams();
    const [contact, setContact] = useState(null);

    return (
        <div className="UserInfo">
            <h2>{contact.username}</h2>
            <p><strong>Full Name:</strong> {contact.fullname}</p>
            <p><strong>Contact Since:</strong> {contact.contactSince}</p>
        </div>
    );
}

export default UserInfo;
