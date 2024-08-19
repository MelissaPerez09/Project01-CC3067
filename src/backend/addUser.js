import { client, xml } from '@xmpp/client';

async function addContact(email, name, onSuccess, onError) {
    // Retrieve the username and password from localStorage
    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');

    if (!username || !password) {
        return onError("User credentials not found.");
    }

    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: '',
        username: `${username}`,
        password: password,
    });

    xmpp.on('error', (err) => {
        console.error('Failed to add contact:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async () => {
        console.log(`Connected as ${username}, adding contact...`);

        // IQ stanza to add the contact
        const addContactIq = xml(
            'iq',
            { type: 'set', id: 'add_contact_1' },
            xml('query', { xmlns: 'jabber:iq:roster' },
                xml('item', { jid: email, name: name || email.split('@')[0] })
            )
        );

        try {
            await xmpp.send(addContactIq);
            console.log("Contact added:", email);

            // Send a subscription request
            const presenceSubscribe = xml(
                'presence',
                { type: 'subscribe', to: email }
            );
            await xmpp.send(presenceSubscribe);
            console.log("Subscription request sent to:", email);

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Failed to add contact or send subscription:', err);
            if (onError) onError(err);
        }

        xmpp.stop(); // Disconnect after adding the contact and sending the subscription
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });
}

export default addContact;
