import { useState, useEffect } from 'react';
import groupFunctions from '../backend/groups';
import '../index.css';
import { Navigate } from 'react-router-dom';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [xmppClient, setXmppClient] = useState(null); // Asegúrate de inicializar xmppClient
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

    const handleJoinGroup = (groupJid) => {
        if (username && password && xmppClient) { // Verifica que xmppClient esté disponible
            groupFunctions.joinRoom(
                xmppClient, // Pasa el cliente XMPP aquí
                groupJid,
                (joinedGroup) => {
                    console.log(`Successfully joined group: ${joinedGroup}`);
                    Navigate('/chat-room');
                },
                (error) => {
                    console.error(`Failed to join group ${groupJid}:`, error);
                    alert(`Failed to join group: ${error.message}`);
                }
            );
        } else {
            console.error('XMPP client is not initialized or credentials are missing.');
        }
    };

    return (
        <div className="add-contacts-container">
            <a href="/profile"> 👤 Back to profile</a>

            <div className="manual-add">
                <h2>Create group chat</h2>
                <input type="text" placeholder="Group name" />
                <input type="text" placeholder="Group members" />
                <button>Create</button>
            </div>
            
            <div className="groups-list">
                <h2>Available Groups</h2>
                <ul>
                    {groups.map(group => (
                        <li key={group.jid} className="contact-card">
                            <div>{group.name}</div>
                            <button onClick={() => handleJoinGroup(group.jid)}>Join</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>      
    );
}

export default Groups;
