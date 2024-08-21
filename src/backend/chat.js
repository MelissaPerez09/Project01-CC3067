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

export function receiveMessage(xmppClient, onMessageReceived) {
    xmppClient.on('stanza', (stanza) => {
        if (stanza.is('message') && stanza.getChild('body')) {
            const from = stanza.attrs.from.split('/')[0]; // Bare JID
            const body = stanza.getChildText('body');
            const message = {
                sender: from,
                text: body
            };
            onMessageReceived(message);
        }
    });
}
