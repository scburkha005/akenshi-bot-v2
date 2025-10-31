import axios from 'axios';
import { findUserByUsername } from '../../db/adapters/users.js';
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING, HMAC_SECRET } = process.env;

export const getAllEventSubscriptions = async () => {
  try {
    const akenshiBot = await findUserByUsername("akenshi__bot");
    const { data } = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Authorization': `Bearer ${akenshiBot.appAccessToken.token}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
    console.log(data)
    const failedSubscriptions = data.data.filter(subscription => {
      return subscription.status === 'webhook_callback_verification_failed'
    });
    
    if (failedSubscriptions.length > 0) {
      console.log('Failed subscriptions found: deleting failed subscriptions');
      await deleteFailedSubscriptions(failedSubscriptions);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

// This subscription will send a notification when any user sends a message to a channel's chat room
export const createChatSubscription = async (twitchUserId) => {
  try {
    const akenshiBot = await findUserByUsername("akenshi__bot");
    console.log(akenshiBot)
    const { data } = await axios.post("https://api.twitch.tv/helix/eventsub/subscriptions", {
      type: "channel.chat.message",
      version: "1",
      condition: {
        broadcaster_user_id: twitchUserId, // broadcaster userId
        user_id: akenshiBot.userId, // bot userId
      },
      transport: {
        method: "webhook",
        callback: "https://akenshi-bot.ashagni.live/api/eventsub",
        secret: HMAC_SECRET
      }
    }, {
      headers: {
        'Authorization': `Bearer ${akenshiBot.appAccessToken.token}`,
        'Client-Id': TWITCH_CLIENT_ID,
        'Content-Type': 'application/json'
      }
    })
    console.log(data)
  } catch (err) {
    console.log(err);
  }
}

export const deleteSubscriptionById = async (subscriptionId) => {
  try {
    console.log(`deleting subscription: ${subscriptionId}`);
    const { data } = await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${akenshiBot.appAccessToken.token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      }
    });
    console.log("subscription deleted successfully", data);
  } catch (err) {
    console.log(err);
  }
}

export const deleteFailedSubscriptions = async (failedSubscriptions) => {
  try {
    const akenshiBot = await findUserByUsername("akenshi__bot");

    failedSubscriptions.forEach(async subscription => {
      let id = subscription.id
      console.log(`deleting subscription: ${id}`);
      await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${akenshiBot.appAccessToken.token}`,
          'Client-Id': TWITCH_CLIENT_ID,
        }
      });
    });

    console.log('finished deleting failed subscriptions');
  } catch (err) {
    console.log(err);
  }
}