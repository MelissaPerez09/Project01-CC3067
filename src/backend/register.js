import { client, xml } from '@xmpp/client';

function registerNewUser(existingUsername, existingPassword, newUsername, newPassword, fullname, onSuccess, onError) {
    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: '',
        username: existingUsername,
        password: existingPassword,
    });

    xmpp.on('status', (status) => {
        console.log('Status:', status);
    });

    xmpp.on('error', (err) => {
        console.error('Failed to connect or register:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async () => {
        console.log(`Connected as ${existingUsername}. Registering new user...`);

        // Send the registration IQ stanza to create the new user
        const iq = xml(
            'iq',
            { type: 'set', id: 'register2' },
            xml('query', { xmlns: 'jabber:iq:register' }, [
                xml('username', {}, newUsername),
                xml('password', {}, newPassword),
                xml('name', {}, fullname),
            ])
        );

        try {
            const result = await xmpp.sendReceive(iq);
            console.log('New account registered successfully:', result);
            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('Registration failed:', err);
            if (onError) onError(err);
        }

        xmpp.stop(); // Disconnect after registration
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });

    return xmpp;
}

export default registerNewUser;
