import { useState, useEffect } from 'react';
import groupFunctions from '../backend/groups';
import '../index.css';
import { Navigate } from 'react-router-dom';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [xmppClient, setXmppClient] = useState(null);
    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    useEffect(() => {
        if (username && password) {
            groupFunctions.getGroups(
                username,
                password,
                (groupList, client) => {
                    setGroups(groupList);
                    setXmppClient(client); // Guarda el cliente XMPP para usarlo luego
                },
                (error) => {
                    console.error('Failed to fetch groups:', error);
                }
            );
        } else {
            console.error('No user credentials found, redirecting to login');
        }
    }, [username, password]);

    return (
        <div className="add-contacts-container">
            <a href="/profile"> 👤 Back to profile</a>

            <div className="manual-add">
                <h2>Create group chat</h2>
                <input type="text" placeholder="Group name" />
                <input type="text" placeholder="Group members" />
                <button>Create</button>
            </div>
        </div>      
    );
}

export default Groups;
