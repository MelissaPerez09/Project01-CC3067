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
            const from = stanza.attrs.from.split('/')[0];
            const body = stanza.getChildText('body');

            const message = {
                sender: from,
                text: body
            };
            onMessageReceived(message);

            // Verifica si se debe activar una notificación
            if (onNotification && document.hidden) {
                onNotification(`New message from ${message.sender}`);
            }
        }
    });
}
