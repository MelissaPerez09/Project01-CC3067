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
                sender = from.split('/')[1];
            } else {
                sender = from.split('/')[0];
            }

            if (sender === xmppClient.jid.local) {
                return;
            }

            let message;
            // Detectar si el mensaje es un enlace de archivo
            if (body.startsWith('http://') || body.startsWith('https://')) {
                const fileName = body.split('/').pop();
                message = {
                    sender: sender || 'Unknown',
                    text: `<a href="${body}" download="${fileName}" target="_blank">Download ${fileName}</a>`
                };
            } else if (body.startsWith('[File:')) {
                const fileName = body.substring(body.indexOf('[') + 6, body.indexOf(']'));
                const base64File = body.substring(body.indexOf(']') + 1);

                const link = document.createElement('a');
                link.href = `data:application/octet-stream;base64,${base64File}`;
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

            onMessageReceived(message);

            if (onNotification && document.hidden) {
                onNotification(`New message from ${message.sender}`);
            }
        }
    });
}
