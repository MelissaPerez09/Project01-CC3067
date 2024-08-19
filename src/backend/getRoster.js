import { client, xml } from '@xmpp/client';

async function getRoster(username, password, onSuccess, onError) {
    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: '',
        username: username,
        password: password,
    });

    xmpp.on('status', (status) => {
        console.log('Status:', status);
    });

    xmpp.on('error', (err) => {
        console.error('Failed to retrieve roster:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async (address) => {
        console.log(`Connected as ${username}, fetching roster...`);

        // Send the roster request
        const iq = xml(
            'iq',
            { type: 'get', id: 'roster1', to: address.toString() }, // Add the 'to' attribute
            xml('query', { xmlns: 'jabber:iq:roster' })
        );

        try {
            const result = await xmpp.sendReceive(iq);
            console.log('Roster retrieved:', result);
            const rosterItems = result.getChild('query').children.map(item => ({
                jid: item.attrs.jid,
                name: item.attrs.name || item.attrs.jid.split('@')[0],
                subscription: item.attrs.subscription
            }));
            if (onSuccess) onSuccess(rosterItems);
        } catch (err) {
            console.error('Failed to retrieve roster:', err);
            if (onError) onError(err);
        }

        xmpp.stop(); // Disconnect after fetching the roster
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });

    return xmpp;
}

export default getRoster;
