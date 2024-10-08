/*
    getRoster.js
    Retrieve the user's roster from the XMPP server.
*/

import { xml } from '@xmpp/client';
import connect from './connect';

// Retrieve the user's roster from the XMPP server
async function getRoster(username, password, onSuccess, onError, onNotification) {
    const xmpp = connect(username, password);

    xmpp.on('error', (err) => {
        console.error('Failed to retrieve roster:', err);
        if (onError) onError(err);
    });

    // Retrieve the user's roster
    xmpp.on('online', async () => {
        try {
            const contacts = await fetchContacts(xmpp);
            onSuccess(contacts);

            // Send presence to the server
            const presence = xml('presence');
            xmpp.send(presence).then(() => {
                //console.log("Presence sent.");
            }).catch(err => {
                console.error("Failed to send presence:", err);
            });

        } catch (err) {
            console.error('Failed to retrieve roster:', err);
            onError(err);
        }

        // Subscribe to presence updates and subscription requests
        xmpp.on('stanza', (stanza) => {
            // Process incoming presence stanzas
            if (stanza.is('presence')) {
                const from = stanza.attrs.from.split('/')[0];
                const presenceType = stanza.attrs.type || 'available';
                const show = stanza.getChildText('show') || 'online';

                //console.log(`Processing presence from ${from} with type: ${presenceType} and show: ${show}`);

                if (presenceType === 'subscribe') {
                    //console.log(`Received subscription request from: ${from}`);
                    if (onNotification) {
                        onNotification({ jid: from, type: 'subscribe' });
                    }
                } else if (presenceType === 'unavailable') {
                    //console.log(`User ${from} is unavailable.`);
                    onSuccess((prevContacts) =>
                        prevContacts.map((contact) =>
                            contact.jid === from
                                ? { ...contact, state: 'disconnected' }
                                : contact
                        )
                    );
                } else {
                    //console.log(`User ${from} is ${show}.`);
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

    return xmpp;
}

// Fetch the user's roster from the XMPP server
async function fetchContacts(xmppClient) {
    return new Promise((resolve, reject) => {
        const rosterIq = xml(
            'iq',
            { type: 'get', id: 'roster1' },
            xml('query', { xmlns: 'jabber:iq:roster' })
        );

        let contacts = [];
        // Process the roster response
        xmppClient.on('stanza', async (stanza) => {
            if (stanza.is('iq') && stanza.getChild('query')) {
                const items = stanza.getChild('query').getChildren('item');

                items.forEach(item => {
                    const subscription = item.attrs.subscription;
                    //console.log(`Contact: ${item.attrs.jid}, Subscription: ${subscription}`);

                    // Get the contact's name and subscription status
                    if (subscription === 'both') {
                        contacts.push({
                            jid: item.attrs.jid,
                            name: item.attrs.name || item.attrs.jid.split('@')[0],
                            state: "disconnected",
                            imageUrl: 'http://imgfz.com/i/9gODMzi.png'
                        });
                    }
                });

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
