/*
    manageNotifications.js
    Handle subscription requests and presence notifications from 1-1 conversations.
*/

import { xml } from '@xmpp/client';

// Send a subscription request and automatically accept the subscription
export function sendAndAcceptSubscription(xmppClient, jid) {
    const presenceSubscribe = xml('presence', { type: 'subscribe', to: jid });
    const presenceSubscribed = xml('presence', { type: 'subscribed', to: jid });

    // Send subscription request to a contact
    return xmppClient.send(presenceSubscribe)
        .then(() => {
            console.log(`Subscription request sent to ${jid}`);
            return xmppClient.send(presenceSubscribed);
        })
        .then(() => {
            //console.log(`Subscription automatically accepted for ${jid}`);
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

// Accept a subscription request
export function acceptSubscription(xmppClient, jid) {
    const presenceSubscribed = xml('presence', { type: 'subscribed', to: jid });
    const presenceAvailable = xml('presence', { to: jid });

    // Send subscription request accepted and available presence
    return xmppClient.send(presenceSubscribed)
        .then(() => {
            console.log(`Subscription accepted for: ${jid}`);
            return xmppClient.send(presenceAvailable);
        })
        .catch(err => {
            console.error(`Failed to accept subscription for ${jid}:`, err);
        });
}

// Reject a subscription request
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
