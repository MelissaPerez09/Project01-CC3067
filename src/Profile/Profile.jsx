import { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { IoPersonAdd } from "react-icons/io5"
import { IoIosChatbubbles } from "react-icons/io"
import { TbHttpDelete } from "react-icons/tb"
import { Link, useNavigate } from 'react-router-dom'
import getRoster from '../backend/getRoster'
import deleteAccount from '../backend/deleteAccount'  
import '../index.css'
import './Profile.css'

function Profile() {
    const [contacts, setContacts] = useState([]);
    const [xmppClient, setXmppClient] = useState(null); 
    const navigate = useNavigate();

    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    useEffect(() => {
        if (username && password) {
            const clientPromise = getRoster(username, password, (roster) => {
                setContacts(roster);
            }, (error) => {
                console.error('Failed to fetch roster:', error);
            });

            clientPromise.then(client => {
                setXmppClient(client);

                // Manejar solicitudes de suscripción
                client.on('stanza', (stanza) => {
                    if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
                        const from = stanza.attrs.from;
                        console.log(`Received subscription request from: ${from}`);

                        // Aceptar automáticamente la solicitud de suscripción
                        const presenceSubscribed = client.xml('presence', { type: 'subscribed', to: from });
                        client.send(presenceSubscribed).then(() => {
                            console.log(`Subscription accepted for: ${from}`);

                            // Opcional: Enviar una solicitud de suscripción de vuelta
                            const presenceSubscribeBack = client.xml('presence', { type: 'subscribe', to: from });
                            client.send(presenceSubscribeBack).then(() => {
                                console.log(`Sent subscription request back to: ${from}`);
                            }).catch(err => console.error('Failed to send subscription request back:', err));

                        }).catch(err => console.error('Failed to accept subscription:', err));
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

    const handleContactClick = (contact) => {
        navigate(`/usersinfo/${contact.jid}`, { state: { contact } });
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