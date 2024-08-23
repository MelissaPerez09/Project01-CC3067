/*
    chat.js
    Send and receive messages using XMPP.
*/

import { xml } from '@xmpp/client';

// Send a message to a contact (1-1 communication)
export function sendMessage(xmppClient, to, message) {
    // Create a message stanza structure
    const messageStanza = xml(
        'message',
        { to, type: 'chat' },
        xml('body', {}, message)
    );

    // Send the message
    xmppClient.send(messageStanza).then(() => {
        console.log(`Message sent to ${to}`);
    }).catch(err => {
        console.error(`Failed to send message to ${to}:`, err);
    });
}

// Send a message to a group chat
export function sendGroupMessage(xmppClient, roomJid, message) {
    // Create a message stanza structure
    const messageStanza = xml(
        'message',
        { to: roomJid, type: 'groupchat' },
        xml('body', {}, message)
    );

    // Send the message
    xmppClient.send(messageStanza).then(() => {
        console.log(`Message sent to group ${roomJid}`);
    }).catch(err => {
        console.error(`Failed to send message to group ${roomJid}:`, err);
    });
}

// Receive messages from contacts and group chats
export function receiveMessage(xmppClient, onMessageReceived, onNotification = null) {
    // Listen for incoming messages
    xmppClient.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.getChild('body')) {
            const from = stanza.attrs.from; 
            const body = stanza.getChildText('body');

            // Extract the sender's username
            let sender;
            if (stanza.attrs.type === 'groupchat') {
                sender = from.split('/')[1];
            } else {
                sender = from.split('/')[0];
            }

            if (sender === xmppClient.jid.local) {
                return;
            }

            // Check if the message is a file download
            let message;
            if (body.startsWith('http://') || body.startsWith('https://')) {
                const fileName = body.split('/').pop();
                message = {
                    sender: sender || 'Unknown',
                    text: `<a href="${body}" download="${fileName}" target="_blank">Download ${fileName}</a>`
                };
            }
            // Check if the message is a file upload
            else if (body.startsWith('[File:')) {
                const fileName = body.substring(body.indexOf('[') + 6, body.indexOf(']'));
                const base64File = body.substring(body.indexOf(']') + 1);

                const link = document.createElement('a');
                link.href = `data:application/octet-stream;base64,${base64File}`; // Base64 encoded file
                link.download = fileName;
                link.innerHTML = `Download: ${fileName}`;

                message = {
                    sender: sender || 'Unknown',
                    text: link.outerHTML
                };
            } else {
                message = {
                    sender: sender || 'Unknown',
                    text: body
                };
            }

            // Notify the frontend about the incoming message
            onMessageReceived(message);

            // Notify the user if the chat window is not visible
            if (onNotification && document.hidden) {
                onNotification(`New message from ${message.sender}`);
            }
        }
    });
}
