import { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { IoPersonAdd } from "react-icons/io5"
import { IoIosChatbubbles } from "react-icons/io"
import { TbHttpDelete } from "react-icons/tb"
import { Link, useNavigate } from 'react-router-dom'
import getRoster from '../backend/getRoster'
import '../index.css'
import './Profile.css'

function Profile() {
    const [contacts, setContacts] = useState([]);
    const [xmppClient, setXmppClient] = useState(null); // Guardar el cliente XMPP
    const navigate = useNavigate();

    // Retrieve stored username and password from localStorage
    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    useEffect(() => {
        if (username && password) {
            const clientPromise = getRoster(username, password, (roster) => {
                setContacts(roster);
            }, (error) => {
                console.error('Failed to fetch roster:', error);
            });

            // Guardar la instancia del cliente XMPP para poder detenerla más tarde
            clientPromise.then(client => {
                setXmppClient(client);
            }).catch(error => {
                console.error('Failed to set XMPP client:', error);
            });
        } else {
            console.error('No user credentials found, redirecting to login');
            navigate('/'); // Redirect to login if credentials are not found
        }
    }, [username, password, navigate]);

    const handleLogout = () => {
        if (xmppClient && xmppClient.stop) {
            xmppClient.stop().catch(err => console.error("Failed to stop XMPP client:", err)); // Detener el cliente XMPP
        } else {
            console.error('XMPP client is not available or does not have a stop method');
        }
        localStorage.removeItem('xmppUsername'); // Limpiar las credenciales almacenadas
        localStorage.removeItem('xmppPassword');
        navigate('/'); // Redirigir a la página de inicio de sesión
    };

    const handleContactClick = (contactId) => {
        // Navigate to contact details
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
                        <li key={index} className="contact-card" onClick={() => handleContactClick(contact.jid)}>
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
                    <Link to="/delete-account">
                        <button className="MenuButton" title="Delete Account"><TbHttpDelete /></button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Profile;