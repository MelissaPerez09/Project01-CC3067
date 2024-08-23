/*
    Profile.jsx
    Manages the profile page, including:
        - displaying contacts and notifications
        - handling logout, account deletion, adding contacts, creating groups
        - navigating to the chat room
*/

import { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { IoPersonAdd } from "react-icons/io5"
import { IoIosChatbubbles } from "react-icons/io"
import { TbHttpDelete } from "react-icons/tb"
import { MdGroups } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'
import getRoster from '../backend/getRoster'
import deleteAccount from '../backend/deleteAccount'
import { acceptSubscription, rejectSubscription } from '../backend/manageNotifications'
import '../index.css'
import './Profile.css'

function Profile() {
    const [contacts, setContacts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [xmppClient, setXmppClient] = useState(null);
    const navigate = useNavigate();

    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    // Fetch the user's roster and set up the XMPP client
    useEffect(() => {
        if (username && password) {
            const clientPromise = getRoster(username, password, (roster) => {
                setContacts(roster);
            }, (error) => {
                console.error('Failed to fetch roster:', error);
            });

            clientPromise.then(client => {
                setXmppClient(client);

                // Monitor incoming presence and message stanzas
                client.on('stanza', (stanza) => {
                    if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
                        const from = stanza.attrs.from;
                        console.log(`Received subscription request from: ${from}`);

                        // Add a notification for the new subscription request
                        setNotifications(prevNotifications => [
                            ...prevNotifications,
                            { jid: from, type: 'subscribe', text: `New subscription request from ${from}` }
                        ]);
                    } else if (stanza.is('message') && stanza.getChild('body')) {
                        const from = stanza.attrs.from;
                        const body = stanza.getChildText('body');

                        // Notification for new messages
                        setNotifications(prevNotifications => [
                            ...prevNotifications,
                            { jid: from, type: 'message', text: `New message from ${from.split('/')[0].split('@')[0]}: ${body}` }                        ]);
                    }
                });
            }).catch(error => {
                console.error('Failed to set XMPP client:', error);
            });
        } else {
            console.error('No user credentials found, redirecting to login');
            navigate('/');
        }
    }, [username, password, navigate]);

    // Handle logout
    const handleLogout = () => {
        if (xmppClient && xmppClient.stop) {
            xmppClient.stop().catch(err => console.error("Failed to stop XMPP client:", err));
        } else {
            console.error('XMPP client is not available or does not have a stop method');
        }
        localStorage.removeItem('xmppUsername');
        localStorage.removeItem('xmppPassword');
        navigate('/');
    };

    // Handle account deletion
    const handleDeleteAccount = () => {
        deleteAccount(() => {
            console.log("Account deleted successfully");
            localStorage.removeItem('xmppUsername');
            localStorage.removeItem('xmppPassword');
            navigate('/');
        }, (error) => {
            console.error("Failed to delete account:", error);
        });
    };

    // Handle contact click to naviate to the user's info page
    const handleContactClick = (contact) => {
        navigate(`/usersinfo/${contact.jid}`, { state: { contact } });
    };

    // Handle subscription request
    const handleAcceptRequest = (jid) => {
        if (xmppClient) {
            acceptSubscription(xmppClient, jid).then(() => {
                setNotifications(prevNotifications => prevNotifications.filter(n => n.jid !== jid));
            });
        }
    };

    // Handle subscription rejection
    const handleRejectRequest = (jid) => {
        if (xmppClient) {
            rejectSubscription(xmppClient, jid).then(() => {
                setNotifications(prevNotifications => prevNotifications.filter(n => n.jid !== jid));
            });
        }
    };

    return (
        <div className="Profile">
            <button onClick={handleLogout} className="LogoutButton">
                <MdLogout />
            </button>

            <div className="username">
                <FaUserCircle size={60} />
                <h1>{username}</h1>
            </div>

            <div className="notifications">
                <h2>Notifications:</h2>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index} className="notification-card">
                            {notification.type === 'subscribe' ? (
                                <>
                                    <p>{notification.text}</p>
                                    <button onClick={() => handleAcceptRequest(notification.jid)}>Accept</button>
                                    <button onClick={() => handleRejectRequest(notification.jid)}>Reject</button>
                                </>
                            ) : (
                                <p>{notification.text}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="contacts">
                <h2>Contacts:</h2>
                <ul>
                    {contacts.map((contact, index) => (
                        <li key={index} className="contact-card" onClick={() => handleContactClick(contact)}>
                            <h3>{contact.name}</h3>
                            <p>{contact.state}</p>
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
                    <Link to="/create-group">
                        <button className="MenuButton" title="Create group"><MdGroups /></button>
                    </Link>
                </div>
                <div className="MenuItem">
                    <Link to="/chat-room">
                        <button className="MenuButton" title="Chat Room"><IoIosChatbubbles /></button>
                    </Link>
                </div>
                <div className="MenuItem">
                    <button className="MenuButton" title="Delete Account" onClick={handleDeleteAccount}><TbHttpDelete /></button>
                </div>
            </div>
        </div>
    );
}

export default Profile;