import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import './Users.css';
import addContact from '../backend/addUser';
import { sendAndAcceptSubscription } from '../backend/manageNotifications';
import getRoster from '../backend/getRoster';

function Users() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [users, setUsers] = useState(['username1', 'username2', 'username3', 'username4']);
    const [xmppClient, setXmppClient] = useState(null);
    const navigate = useNavigate();

    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    // Obtén el cliente XMPP cuando el componente se monta
    useState(() => {
        getRoster(username, password, () => {}, (error) => {
            console.error('Failed to fetch XMPP client:', error);
        }).then(client => {
            setXmppClient(client);
        }).catch(error => {
            console.error('Failed to initialize XMPP client:', error);
        });
    }, []);
    
    const handleAddContact = () => {
        if (email) {
            addContact(email, name, 
                () => {
                    console.log("Contact added successfully!");
                    if (xmppClient) {
                        sendAndAcceptSubscription(xmppClient, email)
                            .then(() => {
                                console.log(`Subscription request sent and accepted for ${email}`);
                                navigate('/profile');
                            })
                            .catch(err => {
                                console.error(`Failed to send and accept subscription for ${email}:`, err);
                            });
                    } else {
                        console.error("XMPP client not initialized");
                    }
                },
                (error) => {
                    console.error("Failed to add contact:", error);
                }
            );
        } else {
            console.error("Email (JID) is required to add a contact");
        }
    };

    return (
        <div className="add-contacts-container">
            <a href="/profile"> 👤 Back to profile</a>
            <h2>Add contact</h2>
            <div className="manual-add">
                <input 
                    type="text" 
                    placeholder="Enter email (JID)" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Enter name (optional)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="add-button" onClick={handleAddContact}>Add Contact</button>
            </div>
        </div>      
    );
}

export default Users;