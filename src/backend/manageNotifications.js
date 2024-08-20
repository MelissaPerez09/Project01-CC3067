import { xml } from '@xmpp/client';

export function sendAndAcceptSubscription(xmppClient, jid) {
    const presenceSubscribe = xml('presence', { type: 'subscribe', to: jid });
    const presenceSubscribed = xml('presence', { type: 'subscribed', to: jid });

    return xmppClient.send(presenceSubscribe)
        .then(() => {
            console.log(`Subscription request sent to ${jid}`);
            return xmppClient.send(presenceSubscribed);
        })
        .then(() => {
            console.log(`Subscription automatically accepted for ${jid}`);
            // Enviar presencia disponible
            const presenceAvailable = xml('presence', { to: jid });
            return xmppClient.send(presenceAvailable);
        })
        .then(() => {
            console.log(`Presence sent after accepting subscription for ${jid}`);
        })
        .catch(err => {
            console.error(`Failed to handle subscription with ${jid}:`, err);
        });
}

export function acceptSubscription(xmppClient, jid) {
    const presenceSubscribed = xml('presence', { type: 'subscribed', to: jid });
    const presenceAvailable = xml('presence', { to: jid }); // Presencia disponible

    return xmppClient.send(presenceSubscribed)
        .then(() => {
            console.log(`Subscription accepted for: ${jid}`);
            // Enviar presencia después de aceptar
            return xmppClient.send(presenceAvailable);
        })
        .catch(err => {
            console.error(`Failed to accept subscription for ${jid}:`, err);
        });
}

export function rejectSubscription(xmppClient, jid) {
    const presenceUnsubscribed = xml('presence', { type: 'unsubscribed', to: jid });
    return xmppClient.send(presenceUnsubscribed)
        .then(() => {
            console.log(`Subscription rejected for: ${jid}`);
        })
        .catch(err => {
            console.error(`Failed to reject subscription for ${jid}:`, err);
        });
}
