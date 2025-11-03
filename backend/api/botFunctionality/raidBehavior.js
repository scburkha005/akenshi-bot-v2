import { sendMessage } from "../modules/eventsub.js";
import { findUserByTwitchId } from "../../db/adapters/users.js";
import { getChannelInformation, sendShoutout } from "../modules/twitchRequest.js";

const raidChatShoutout = async (broadcaster, notification) => {
  try {
    const { autoShoutoutRaid, gtotMode } = broadcaster.botSettings.toggle;
    if (autoShoutoutRaid) {
      let raider = notification.event.from_broadcaster_user_name;
      let broadcasterId = notification.event.to_broadcaster_user_id;
      let raiderId = notification.event.from_broadcaster_user_id;
      if (gtotMode && broadcaster.botSettings.gtotModeEnabled) {
        await sendMessage(broadcasterId, `Yo shoutout my dawg ${raider}`);
        return;
      }
      const { game_name } = await getChannelInformation(raiderId);
      await sendMessage(broadcasterId, `Check out ${raider}, they are playing ${game_name} at https://twitch.tv/${raider.toLowerCase()}`);
      await sendShoutout(broadcasterId, raiderId, broadcaster.userAccessToken.token);
    }
  } catch (err) {
    console.log('error while shouting out raid in chat')
    throw err;
  }
}

// Parent of all raid handlers
const raidHandler = async (notification) => {
  try {
    if (notification.subscription.type === 'channel.raid') {
      const broadcaster = await findUserByTwitchId(notification.event.to_broadcaster_user_id);
      // Chat shoutout based on Gtot mode
      await raidChatShoutout(broadcaster, notification);
    }
  } catch (err) {
    console.log('there was an error during the raid handling process');
    throw err;
  }
}

export default raidHandler;