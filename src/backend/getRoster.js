import { client, xml } from '@xmpp/client';

async function getRoster(username, password, onSuccess, onError) {
    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: '',
        username: `${username}`,
        password: password,
    });

    xmpp.on('status', (status) => {
        //console.log('Status:', status);
    });

    xmpp.on('error', (err) => {
        console.error('Failed to retrieve roster:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async () => {
        //console.log(`Connected as ${username}, fetching roster...`);

        try {
            const contacts = await fetchContacts(xmpp);
            onSuccess(contacts);
        } catch (err) {
            console.error('Failed to retrieve roster:', err);
            onError(err);
        }

        // Do not stop here so the client remains active for logout
        // xmpp.stop(); 
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });

    return xmpp; // Return the XMPP client instance
}

async function fetchContacts(xmppClient) {
    return new Promise((resolve, reject) => {
        const rosterIq = xml(
            'iq',
            { type: 'get', id: 'roster1' },
            xml('query', { xmlns: 'jabber:iq:roster' })
        );

        let contacts = [];

        xmppClient.on('stanza', async (stanza) => {
            if (stanza.is('iq') && stanza.getChild('query')) {
                const items = stanza.getChild('query').getChildren('item');

                contacts = items.map(item => {
                    const subscription = item.attrs.subscription;
                    console.log(`Contact: ${item.attrs.jid}, Subscription: ${subscription}`);
                    return {
                        jid: item.attrs.jid,
                        name: item.attrs.name || item.attrs.jid.split('@')[0],
                        subscription: subscription,
                        state: "disconnected", // State will be updated by presence
                        imageUrl: 'http://imgfz.com/i/9gODMzi.png'
                    };
                });

                for (let contact of contacts) {
                    const probe = xml(
                        'presence',
                        { type: 'probe', to: contact.jid }
                    );
                    await xmppClient.send(probe);
                }

                resolve(contacts);
            } else if (stanza.is('presence')) {
                const from = stanza.attrs.from.split('/')[0]; // Get the bare JID
                const presenceState = stanza.getChildText('show') || 'available';

                contacts = contacts.map(contact =>
                    contact.jid === from
                        ? { ...contact, state: presenceState }
                        : contact
                );
            }
        });

        xmppClient.send(rosterIq).catch((err) => {
            console.error('Error fetching contacts:', err);
            reject(err);
        });
    });
}

export default getRoster;
