/*
    deleteAccount.js
    Delete the user's account from the XMPP server.
*/

import { xml } from '@xmpp/client';
import connect from './connect';

async function deleteAccount(onSuccess, onError) {
    const username = localStorage.getItem('xmppUsername');
    const password = localStorage.getItem('xmppPassword');
    const xmpp = connect(username, password);

    // Check if the user credentials are available
    if (!username || !password) {
        return onError("User credentials not found.");
    }

    // Handle errors
    xmpp.on('error', (err) => {
        console.error('Failed to delete account:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async () => {
        console.log(`Connected as ${username}, deleting account...`);

        const deleteAccountIq = xml(
            'iq',
            { type: 'set', id: 'delete_account' },
            xml('query', { xmlns: 'jabber:iq:register' },
                xml('remove')
            )
        );

        try {
            await xmpp.send(deleteAccountIq);
            console.log("Account deleted successfully");
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Failed to delete account:', err);
            if (onError) onError(err);
        }

        xmpp.stop();
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });
}

export default deleteAccount;
