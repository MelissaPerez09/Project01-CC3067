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

            // Enviar presencia disponible
            const presence = xml('presence');
            xmpp.send(presence).then(() => {
                console.log("Presence sent.");
            }).catch(err => {
                console.error("Failed to send presence:", err);
            });

        } catch (err) {
            console.error('Failed to retrieve roster:', err);
            onError(err);
        }

        // Subscribe to presence updates
        xmpp.on('stanza', (stanza) => {
            //console.log('Received stanza:', stanza.toString());
            if (stanza.is('presence')) {
                const from = stanza.attrs.from.split('/')[0]; // JID sin recurso
                const presenceType = stanza.attrs.type || 'available'; // Tipo de presencia
                const show = stanza.getChildText('show') || 'online'; // Estado

                console.log(`Presence update from ${from}: ${presenceType} - ${show}`);

                // Actualizar estado en la UI
                if (presenceType === 'unavailable') {
                    onSuccess((prevContacts) =>
                        prevContacts.map((contact) =>
                            contact.jid === from
                                ? { ...contact, state: 'disconnected' }
                                : contact
                        )
                    );
                } else {
                    onSuccess((prevContacts) =>
                        prevContacts.map((contact) =>
                            contact.jid === from
                                ? { ...contact, state: show }
                                : contact
                        )
                    );
                }
            }
        });

    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });

    return xmpp; // Retorna la instancia del cliente XMPP
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

                contacts = items.filter(item => {
                    const subscription = item.attrs.subscription;
                    return subscription === 'both' || subscription === 'from' || subscription === 'to';
                }).map(item => ({
                    jid: item.attrs.jid,
                    name: item.attrs.name || item.attrs.jid.split('@')[0],
                    state: "disconnected", // Estado inicial que se actualizará con la presencia
                    imageUrl: 'http://imgfz.com/i/9gODMzi.png'
                }));

                resolve(contacts);
            }
        });

        xmppClient.send(rosterIq).catch((err) => {
            console.error('Error fetching contacts:', err);
            reject(err);
        });
    });
}

export default getRoster;
