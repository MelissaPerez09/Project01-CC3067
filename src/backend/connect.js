import { client, xml } from '@xmpp/client';

function connectXMPP(username, password) {
    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: '',
        username: username,
        password: password,
    });

    xmpp.on('online', async (address) => {
        console.log(`connected to alumchat.lol as ${address.toString()}`);
    });

    xmpp.on('error', (err) => {
        console.error('Failed to connect:', err);
    });

    if (xmpp.status !== 'online' && xmpp.status !== 'connecting') {
        xmpp.start().catch((err) => {
            console.error('Connection error:', err);
        });
    }

    return xmpp;
}

export default connectXMPP;
