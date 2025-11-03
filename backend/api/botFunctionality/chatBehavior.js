import { sendMessage } from "../modules/eventsub.js";
import { findUserByTwitchId, updateUser } from "../../db/adapters/users.js";
const gtotModeHandler = async (broadcaster, notification) => {
  try {
    // If feature is disabled, do nothing
    if (!broadcaster.botSettings.optInGtotMode) {
      return;
    }
    const moderatorsList = broadcaster.channelInfo.moderators;
    const currentUser = notification.event.chatter_user_name;
    const currentMsg = notification.event.message.text.toLowerCase();
    // Handle gtot mode toggling
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === 'enter gtot mode') {
      await updateUser(broadcaster.username, {
        gtotModeEnabled: true
      });
      await sendMessage(notification.event.broadcaster_user_id, `Okayge`);
    }
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === 'exit gtot mode') {
      await updateUser(broadcaster.username, {
        gtotModeEnabled: false
      });
      await sendMessage(notification.event.broadcaster_user_id, `Deadge`);
    }
  } catch (err) {
    console.log('there was an error in gtot mode handler');
    throw err;
  }
}

// This will be the parent of all message handlers
const messageHandler = async (notification) => {
  try {
    const broadcaster = await findUserByTwitchId(notification.event.broadcaster_user_id);
    // Captures message events && ignore messages sent by ourselves (i.e. messages sent by the bot)
    if (notification.subscription.type === 'channel.chat.message' && notification.event.chatter_user_login !== 'akenshi__bot') {
      await gtotModeHandler(broadcaster, notification);
      await sendMessage(notification.event.broadcaster_user_id, `${notification.event.broadcaster_user_name} said ${notification.event.message.text}`);
    }
  } catch (err) {
    console.log('there was an error during the message process');
    throw err;
  }
}

export default messageHandler;