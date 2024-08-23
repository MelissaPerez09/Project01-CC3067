import { client, xml } from '@xmpp/client';

async function getGroups(username, password, onSuccess, onError) {
    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'conference.alumchat.lol',
        resource: '',
        username: `${username}`,
        password: password,
    });

    xmpp.on('status', (status) => {
        console.log('Status:', status);
    });

    xmpp.on('error', (err) => {
        console.error('Failed to retrieve groups:', err);
        if (onError) onError(err);
    });

    xmpp.on('online', async () => {
        console.log(`Connected as ${username}, fetching groups...`);

        try {
            const groups = await fetchGroups(xmpp);
            onSuccess(groups, xmpp); // Pasa xmppClient al onSuccess
        } catch (err) {
            console.error('Failed to retrieve groups:', err);
            if (onError) onError(err);
        }
    });

    xmpp.start().catch((err) => {
        console.error('Failed to connect:', err);
        if (onError) onError(err);
    });

    return xmpp;
}

async function fetchGroups(xmppClient) {
    return new Promise((resolve, reject) => {
        const discoIq = xml(
            'iq',
            { type: 'get', id: 'disco1', to: 'conference.alumchat.lol' },
            xml('query', { xmlns: 'http://jabber.org/protocol/disco#items' })
        );

        let groups = [];

        xmppClient.on('stanza', async (stanza) => {
            if (stanza.is('iq') && stanza.getChild('query')) {
                const items = stanza.getChild('query').getChildren('item');

                items.forEach(item => {
                    groups.push({
                        jid: item.attrs.jid,
                        name: item.attrs.name || item.attrs.jid.split('@')[0],
                    });
                });

                resolve(groups);
            }
        });

        xmppClient.send(discoIq).catch((err) => {
            console.error('Error fetching groups:', err);
            reject(err);
        });
    });
}

async function joinRoom(xmppClient, roomJid) {
    return new Promise((resolve, reject) => {
        const localJid = xmppClient.jid && xmppClient.jid.local ? xmppClient.jid.local : null;

        if (!localJid) {
            return reject(new Error('JID local is undefined, cannot join room'));
        }

        const presence = xml(
            'presence',
            { to: `${roomJid}/${localJid}` },
            xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );

        xmppClient.send(presence).then(() => {
            console.log(`Joined group ${roomJid}`);
            resolve();
        }).catch((err) => {
            console.error('Error joining group:', err);
            reject(err);
        });
    });
}

export async function createGroup(xmppClient, roomName, nickname) {
    const roomJid = `${roomName}@conference.alumchat.lol`;  // Ajusta el dominio según tu servidor XMPP

    // Paso 1: Enviar presencia inicial para crear la sala
    const presenceStanza = xml(
        'presence',
        { to: `${roomJid}/${nickname}` },
        xml('x', 'http://jabber.org/protocol/muc')
    );

    xmppClient.send(presenceStanza).then(() => {
        console.log(`Presence sent to create room ${roomJid}`);
    }).catch(err => {
        console.error(`Failed to send presence to create room ${roomJid}:`, err);
    });

    // Paso 2: Configurar la sala para que se cree instantáneamente y sea persistente
    const iqStanza = xml(
        'iq',
        { type: 'set', to: roomJid },
        xml('query', { xmlns: 'http://jabber.org/protocol/muc#owner' },
            xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                    xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig')
                ),
                xml('field', { var: 'muc#roomconfig_persistentroom' },  // Configurar como sala persistente
                    xml('value', {}, '1')
                ),
                xml('field', { var: 'muc#roomconfig_publicroom' },  // Hacer la sala pública
                    xml('value', {}, '1')
                )
            )
        )
    );

    return new Promise((resolve, reject) => {
        xmppClient.send(iqStanza).then(() => {
            console.log(`Room ${roomJid} created successfully`);
            resolve(roomJid);  // Devuelve el JID de la sala creada
        }).catch(err => {
            console.error(`Failed to create room ${roomJid}:`, err);
            reject(err);
        });
    });
}

export default {getGroups, joinRoom, createGroup};
