import { Strophe, $msg, $iq, $pres } from 'strophe.js';

const WEBSOCKET_SERVICE = 'ws://alumchat.lol:7070/ws/';

let connection = null;

export const connect = (jid, password, onConnect, onMessage) => {
    connection = new Strophe.Connection(WEBSOCKET_SERVICE, { protocol: 'ws' });

    connection.connect(jid, password, (status) => {
        if (status === Strophe.Status.CONNECTING) {
            console.log('Strophe is connecting.');
        } else if (status === Strophe.Status.CONNFAIL) {
            console.log('Strophe failed to connect.');
        } else if (status === Strophe.Status.DISCONNECTING) {
            console.log('Strophe is disconnecting.');
        } else if (status === Strophe.Status.DISCONNECTED) {
            console.log('Strophe is disconnected.');
        } else if (status === Strophe.Status.CONNECTED) {
            console.log('Strophe is connected.');
            connection.addHandler(onMessage, null, 'message', null, null, null);
            connection.send(Strophe.$pres().tree());
            onConnect();
        }
    });    
};

export const sendMessage = (to, message) => {
    const msg = Strophe.$msg({
        to,
        type: 'chat'
    }).c('body').t(message);
    connection.send(msg.tree());
};

export const disconnect = () => {
    connection.disconnect();
};
