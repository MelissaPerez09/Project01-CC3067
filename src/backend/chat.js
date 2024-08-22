import { xml } from '@xmpp/client';

export function sendMessage(xmppClient, to, message) {
    const messageStanza = xml(
        'message',
        { to, type: 'chat' },
        xml('body', {}, message)
    );

    xmppClient.send(messageStanza).then(() => {
        console.log(`Message sent to ${to}`);
    }).catch(err => {
        console.error(`Failed to send message to ${to}:`, err);
    });
}

export function sendGroupMessage(xmppClient, roomJid, message) {
    const messageStanza = xml(
        'message',
        { to: roomJid, type: 'groupchat' },
        xml('body', {}, message)
    );

    xmppClient.send(messageStanza).then(() => {
        console.log(`Message sent to group ${roomJid}`);
    }).catch(err => {
        console.error(`Failed to send message to group ${roomJid}:`, err);
    });
}

export function receiveMessage(xmppClient, onMessageReceived, onNotification = null) {
    xmppClient.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.getChild('body')) {
            const from = stanza.attrs.from; 
            const body = stanza.getChildText('body');

            let sender;
            if (stanza.attrs.type === 'groupchat') {
                // Extract the nickname part after '/'
                sender = from.split('/')[1];
            } else {
                // For direct messages, extract the bare JID
                sender = from.split('/')[0];
            }

            // Check if the message is from the current user, if so, ignore it
            if (sender === xmppClient.jid.local) {
                return;
            }

            const message = {
                sender: sender || 'Unknown',  // Use the nickname or bare JID
                text: body
            };

            onMessageReceived(message);

            // Trigger notification if the tab is hidden
            if (onNotification && document.hidden) {
                onNotification(`New message from ${message.sender}`);
            }
        }
    });
}
