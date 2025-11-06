import { sendMessage } from "../modules/eventsub.js";
import { findUserByTwitchId, updateUser } from "../../db/adapters/users.js";
import { createGPTMessage } from "../modules/openAi.js";
const gtotModeHandler = async (broadcaster, notification) => {
  try {
    // If feature is disabled, do nothing
    if (!broadcaster.botSettings.toggle.gtotMode) {
      return;
    }
    const moderatorsList = broadcaster.channelInfo.moderators;
    const currentUser = notification.event.chatter_user_name;
    const currentMsg = notification.event.message.text.toLowerCase();
    // Handle gtot mode toggling
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === 'enter gtot mode') {
      await updateUser(broadcaster.username, {
        botSettings: {
          gtotModeEnabled: true
        }
      });
      await sendMessage(notification.event.broadcaster_user_id, `Okayge`);
    }
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === 'exit gtot mode') {
      await updateUser(broadcaster.username, {
        botSettings: {
          gtotModeEnabled: false
        }
      });
      await sendMessage(notification.event.broadcaster_user_id, `Deadge`);
    }
    // Chat features for when gtot mode is enabled
    if (broadcaster.botSettings.gtotModeEnabled) {
      // Handle gtot random ya mama
      let onePercentChance = (Math.floor(Math.random() * 100) + 1) === 100;
      if (onePercentChance) {
        await sendMessage(notification.event.broadcaster_user_id, `Ya mama @${currentUser}`);
      }
    }
  } catch (err) {
    console.log('there was an error in gtot mode handler');
    throw err;
  }
}

const randomInsultHandler = async (broadcaster, notification) => {
  try {
    // If feature is disabled, do nothing
    if (!broadcaster.botSettings.toggle.randomInsult) {
      return;
    }
    let onePercentChance = (Math.floor(Math.random() * 100) + 1) === 100;
    if (onePercentChance) {
      const currentUser = notification.event.chatter_user_name;
      const currentMsg = notification.event.message.text.toLowerCase();
      const response = await createGPTMessage(currentMsg);
      await sendMessage(notification.event.broadcaster_user_id, `${response} @${currentUser}`)
    }
  } catch (err) {
    console.log('there was an error in randomInsultHandler');
    throw err;
  }
}

// This will be the parent of all message handlers
const messageHandler = async (notification) => {
  try {
    // Captures channel.chat.message events subscriptions && ignore messages sent by ourselves (i.e. messages sent by the bot)
    if (notification.subscription.type === 'channel.chat.message' && notification.event.chatter_user_login !== 'akenshi__bot') {
      const broadcaster = await findUserByTwitchId(notification.event.broadcaster_user_id);
      await gtotModeHandler(broadcaster, notification);
      await randomInsultHandler(broadcaster, notification);
    }
  } catch (err) {
    console.log('there was an error during the message process');
    throw err;
  }
}

export default messageHandler;