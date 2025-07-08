const axios = require('axios');
const { findUser } = require('../../db/adapters/users');
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING, HMAC_SECRET } = process.env;
const getEventSubscriptions = async () => {
  try {
    const akenshiBot = await findUser("1265515088");
    const { data } = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Authorization': `Bearer ${akenshiBot.appAccessToken}`,
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
  } catch (err) {
    console.log(err);
  }
}

// This subscription will send a notification when any user sends a message to a channel's chat room
const createChatSubscription = async () => {
  try {
    const akenshiBot = await findUser("1265515088");
    console.log(akenshiBot)
    const { data } = await axios.post("https://api.twitch.tv/helix/eventsub/subscriptions", {
      type: "channel.chat.message",
      version: "1",
      condition: {
        broadcaster_user_id: "187093318", // broadcaster userId
        user_id: akenshiBot.userId, // bot userId
      },
      transport: {
        method: "webhook",
        callback: "https://akenshi-bot.ashagni.live/eventsub",
        secret: HMAC_SECRET
      }
    }, {
      headers: {
        'Authorization': `Bearer ${akenshiBot.appAccessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
        'Content-Type': 'application/json'
      }
    })
    console.log(data)
  } catch (err) {
    console.log(err);
  }
}

const deleteFailedSubscriptions = async (failedSubscriptions) => {
  try {
    const akenshiBot = await findUser("1265515088");

    failedSubscriptions.forEach(async subscription => {
      let id = subscription.id
      console.log(`deleting subscription: ${id}`);
      await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${akenshiBot.appAccessToken}`,
          'Client-Id': TWITCH_CLIENT_ID,
        }
      });
    });

    console.log('finished deleting failed subscriptions');
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    createChatSubscription,
    getEventSubscriptions,
    deleteFailedSubscriptions
}