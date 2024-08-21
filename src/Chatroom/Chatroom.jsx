import React, { useState, useEffect } from 'react';
import './Chatroom.css';
import { sendMessage, receiveMessage } from '../backend/chat';
import getRoster from '../backend/getRoster';

function Chatroom() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [recipientJid, setRecipientJid] = useState("");
    const [xmppClient, setXmppClient] = useState(null);

    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    useEffect(() => {
        if (username && password) {
            const clientPromise = getRoster(
                username,
                password,
                () => {}, // No necesitamos manejar los contactos aquí
                (error) => {
                    console.error('Failed to fetch roster:', error);
                }
            );

            clientPromise.then(client => {
                setXmppClient(client);
                receiveMessage(client, (msg) => {
                    setMessages(prevMessages => [...prevMessages, msg]);
                });
            }).catch(error => {
                console.error('Failed to set XMPP client:', error);
            });
        } else {
            console.error('No user credentials found, redirecting to login');
        }
    }, [username, password]);

    const handleSendMessage = () => {
        if (message.trim() && recipientJid.trim() && xmppClient) {
            const newMessage = { text: message, sender: "Me" };
            setMessages([...messages, newMessage]);
            sendMessage(xmppClient, recipientJid, message);
            setMessage("");
        } else {
            console.error('Message or recipient JID is empty, or XMPP client is not initialized');
        }
    };

    return (
        <div className="chat">
            <a href="/profile"> 👤 Back to profile</a>
            <div className="chatroom-container">
                <div className="chat-area">
                    <div className="chat-header">
                        <div className="contact-info">
                            <div className="contact-avatar"></div>
                            <input 
                                type="text" 
                                placeholder="Enter recipient JID..." 
                                value={recipientJid} 
                                onChange={(e) => setRecipientJid(e.target.value)} 
                                className="jid-input"
                            />
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
                        />
                        <button onClick={handleSendMessage}>⬆️</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatroom;
