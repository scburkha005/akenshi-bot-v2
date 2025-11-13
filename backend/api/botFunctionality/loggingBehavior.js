import { createEventSubscriptionLog, getEventSubscriptionLogByBroadcasterId } from '../../db/adapters/eventSubs.js';
export const eventsubLogHandler = async (notification, broadcasterId) => {
  try {
    let subscriptionType = notification.subscription.type;
    let isDuplicateEvent = await duplicateEventHandler(broadcasterId, notification, subscriptionType)
    // If we hit a duplicate event, return immediately
    if (isDuplicateEvent) {
      return isDuplicateEvent;
    }
    console.log('notification running')
    console.log(notification)
    // Log subscriptions, different subscription types may require different identifiers to be logged
    if (subscriptionType === 'channel.chat.message') {
      await createEventSubscriptionLog(broadcasterId, notification.event.message_id);
    } else if (subscriptionType === 'channel.raid') {
      await createEventSubscriptionLog(broadcasterId, notification.event.from_broadcaster_user_id);
    }

    return isDuplicateEvent;
  } catch (err) {
    console.log('error while logging subscriptions');
    throw err;
  }
}

export const duplicateEventHandler = async (broadcasterId, notification, subscriptionType) => {
  try {
    let eventsubLog = await getEventSubscriptionLogByBroadcasterId(broadcasterId);
    if (subscriptionType === 'channel.chat.message') {
      if (eventsubLog.includes(notification.event.message_id)) {
        return true;
      }
    }
    if (subscriptionType === 'channel.raid') {
      if (eventsubLog.includes(notification.event.from_broadcaster_user_id)) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.log('error while checking duplicate events');
    throw err;
  }
}