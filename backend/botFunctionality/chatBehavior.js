// This will be the parent of all message handlers
import { sendMessage } from "../api/modules/eventsub.js";
const messageHandler = async (notification) => {
  try {
    // Captures message events && ignore messages sent by ourselves (i.e. messages sent by the bot)
    if (notification.subscription.type === 'channel.chat.message' && notification.event.chatter_user_login !== 'akenshi__bot') {
      await sendMessage(notification.event.broadcaster_user_id, `${notification.event.broadcaster_user_name} said ${notification.event.message.text}`);
    }
  } catch (err) {
    console.log('there was an error during the message process');
    throw err;
  }
}

export default messageHandler;