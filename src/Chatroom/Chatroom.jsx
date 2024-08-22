import React, { useState, useEffect } from 'react';
import './Chatroom.css';
import { sendMessage, receiveMessage, sendGroupMessage } from '../backend/chat';
import getRoster from '../backend/getRoster';
import groupFunctions from '../backend/groups';

function Chatroom() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [recipientJid, setRecipientJid] = useState("");
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isGroupChat, setIsGroupChat] = useState(false);
    const [xmppClient, setXmppClient] = useState(null);

    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    useEffect(() => {
        if (username && password) {
            const clientPromise = getRoster(
                username,
                password,
                (roster) => {
                    setContacts(roster);
                },
                (error) => {
                    console.error('Failed to fetch roster:', error);
                }
            );
    
            clientPromise.then(client => {
                setXmppClient(client);
    
                // Clear previous listeners before adding a new one
                client.removeAllListeners('stanza');
    
                receiveMessage(client, (msg) => {
                    setMessages(prevMessages => [...prevMessages, msg]);
                });
    
                groupFunctions.getGroups(
                    username,
                    password,
                    (groupList) => {
                        setGroups(groupList); // Store the groups in state
                    },
                    (error) => {
                        console.error('Failed to fetch groups:', error);
                    }
                );
    
            }).catch(error => {
                console.error('Failed to set XMPP client:', error);
            });
        } else {
            console.error('No user credentials found, redirecting to login');
        }
    
        // Cleanup function to avoid duplicate listeners
        return () => {
            if (xmppClient) {
                xmppClient.removeAllListeners('stanza');
            }
        };
    }, [username, password]);

    const handleSendMessage = () => {
        if (message.trim() && recipientJid.trim() && xmppClient) {
            const newMessage = { text: message, sender: "Me" };
            setMessages([...messages, newMessage]);
            
            if (isGroupChat) {
                sendGroupMessage(xmppClient, recipientJid, message);
            } else {
                sendMessage(xmppClient, recipientJid, message);
            }

            setMessage("");
        } else {
            console.error('Message or recipient JID is empty, or XMPP client is not initialized');
        }
    };

    const handleContactClick = (jid) => {
        setRecipientJid(jid);
        setMessages([]);
        setMessage("");
        setIsGroupChat(false); // Set to false since it's a direct chat
    };

    const handleGroupClick = async (jid) => {
        try {
            await groupFunctions.joinRoom(xmppClient, jid);
            setRecipientJid(jid);
            setMessages([]);
            setMessage("");
            setIsGroupChat(true); // Set to true since it's a group chat
        } catch (error) {
            console.error('Failed to join group:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat">
            <a href="/profile"> 👤 Back to profile</a>
            <div className="chatroom-container">
                <div className="sidebar">
                    <h3>Chatroom</h3>
                    <div className="direct-chats">
                        <h4>Direct Chats</h4>
                        <ul>
                            {contacts.map(contact => (
                                <li key={contact.jid} onClick={() => handleContactClick(contact.jid)}>
                                    <div>{contact.name} ({contact.state})</div>
                                </li>
                            ))}
                        </ul>
                        <h4>Group Chats</h4>
                        <ul>
                            {groups.map(group => (
                                <li key={group.jid} onClick={() => handleGroupClick(group.jid)}>
                                    <div>{group.name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="chat-area">
                    <div className="chat-header">
                        <div className="contact-info">
                            <div className="contact-avatar"></div>
                            <div className="contact-name">{recipientJid}</div>
                        </div>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="message">
                                <p><strong>{msg.sender}:</strong> {msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSendMessage}>⬆️</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatroom;
