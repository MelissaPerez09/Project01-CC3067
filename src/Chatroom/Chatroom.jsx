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
    const [file, setFile] = useState(null);

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

                client.removeAllListeners('stanza');

                receiveMessage(client, (msg) => {
                    setMessages(prevMessages => [...prevMessages, msg]);
                });

                groupFunctions.getGroups(
                    username,
                    password,
                    (groupList) => {
                        setGroups(groupList);
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

        return () => {
            if (xmppClient) {
                xmppClient.removeAllListeners('stanza');
            }
        };
    }, [username, password]);

    const handleSendMessage = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64File = reader.result.split(',')[1];
                sendBase64Message(base64File, file.name);
            };
            reader.readAsDataURL(file);
        } else if (message.trim() && recipientJid.trim() && xmppClient) {
            const newMessage = { text: message, sender: "Me" };
            setMessages([...messages, newMessage]);

            if (isGroupChat) {
                sendGroupMessage(xmppClient, recipientJid, message);
            } else {
                sendMessage(xmppClient, recipientJid, message);
            }

            setMessage("");
        } else {
            console.error('Message, file or recipient JID is empty, or XMPP client is not initialized');
        }
    };

    const sendBase64Message = (base64File, fileName) => {
        if (recipientJid.trim() && xmppClient) {
            const newMessage = { text: `[File] ${fileName}`, sender: "Me" };
            setMessages([...messages, newMessage]);

            const fullMessage = `[File:${fileName}]${base64File}`;

            if (isGroupChat) {
                sendGroupMessage(xmppClient, recipientJid, fullMessage);
            } else {
                sendMessage(xmppClient, recipientJid, fullMessage);
            }

            setFile(null);
            setMessage(""); // Clear message after sending the file
        } else {
            console.error('Recipient JID is empty, or XMPP client is not initialized');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setMessage(selectedFile.name);
    };

    const handleContactClick = (jid) => {
        setRecipientJid(jid);
        setMessages([]);
        setMessage("");
        setIsGroupChat(false);
        setFile(null);
    };

    const handleGroupClick = async (jid) => {
        try {
            await groupFunctions.joinRoom(xmppClient, jid);
            setRecipientJid(jid);
            setMessages([]);
            setMessage("");
            setIsGroupChat(true);
            setFile(null);
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
                                <p><strong>{msg.sender}:</strong> <span dangerouslySetInnerHTML={{ __html: msg.text }} /></p>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <label htmlFor="file-upload">📎 File</label>
                        <input 
                            type="file" 
                            id="file-upload" 
                            onChange={handleFileChange} 
                        />
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            onKeyDown={handleKeyDown}
                            disabled={!!file}
                        />
                        <button onClick={handleSendMessage}>⬆️</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatroom;
