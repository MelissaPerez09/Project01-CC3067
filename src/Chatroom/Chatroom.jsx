import React, { useState } from 'react';
import './Chatroom.css';

function Chatroom() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: "Me" }]);
            setMessage("");
        }
    };

    return (
        <div className="chat">
            <a href="/profile"> 👤 Back to profile</a>
            <div className="chatroom-container">
                <div className="sidebar">
                    <h3>Chatroom</h3>
                    <div className="direct-chats">
                        <h4>Direct</h4>
                        <ul>
                            <li>Contact 1</li>
                            <li>Contact 2</li>
                        </ul>
                    </div>
                    <div className="group-chats">
                        <h4>Groups</h4>
                        <ul>
                            <li>Group 1</li>
                            <li>Group 2</li>
                        </ul>
                    </div>
                </div>
                <div className="chat-area">
                    <div className="chat-header">
                        <div className="contact-info">
                            <div className="contact-avatar"></div>
                            <h2>Name</h2>
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
