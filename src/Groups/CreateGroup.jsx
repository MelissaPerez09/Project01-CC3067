/*
    CreateGroup.jsx
    Manages creating a new group chat.
*/

import { useState, useEffect } from 'react';
import groupFunctions, { createGroup } from '../backend/groups';
import '../index.css';

function CreateGroup() {
    const [groups, setGroups] = useState([]);
    const [xmppClient, setXmppClient] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [nickname, setNickname] = useState('');
    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    // Fetch the user's groups
    useEffect(() => {
        if (username && password) {
            groupFunctions.getGroups(
                username,
                password,
                (groupList, client) => {
                    setGroups(groupList);
                    setXmppClient(client);
                },
                (error) => {
                    console.error('Failed to fetch groups:', error);
                }
            );
        } else {
            console.error('No user credentials found, redirecting to login');
        }
    }, [username, password]);

    // Handle creating a new group
    const handleCreateGroup = async () => {
        if (!groupName || !nickname) {
            alert("Group name and nickname are required");
            return;
        }

        try {
            const roomJid = await createGroup(xmppClient, groupName, nickname);
            alert(`Group ${groupName} created successfully!`);
        } catch (error) {
            console.error('Failed to create group:', error);
            alert('Failed to create group. Please try again.');
        }
    };

    return (
        <div className="add-contacts-container">
            <a href="/profile"> 👤 Back to profile</a>

            <div className="manual-add">
                <h2>Create group chat</h2>
                <input 
                    type="text" 
                    placeholder="Group name" 
                    value={groupName} 
                    onChange={(e) => setGroupName(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Your nickname" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)} 
                />
                <button onClick={handleCreateGroup}>Create</button>
            </div>
        </div>
    );
}

export default CreateGroup;
