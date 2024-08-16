import { client, xml } from '@xmpp/client/browser';

function registerXMPP(username, password, fullname, onSuccess, onError) {
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
        console.error('Failed to register:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async (address) => {
        console.log(`connected to alumchat.lol as ${address.toString()}`);

        // Realizar el registro
        const iq = xml(
            'iq',
            { type: 'set', id: 'register1' },
            xml('query', { xmlns: 'jabber:iq:register' }, [
                xml('username', {}, username),
                xml('password', {}, password),
                xml('name', {}, fullname),
            ])
        );

        try {
            const result = await xmpp.sendReceive(iq);
            console.log('Account registered successfully:', result);
            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('Registration failed:', err);
            if (onError) onError(err);
        }

        xmpp.stop(); // Desconectar después del registro
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });

    return xmpp;
}

export default registerXMPP;
