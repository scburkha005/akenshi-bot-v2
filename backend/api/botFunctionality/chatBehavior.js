import { sendMessage } from "../modules/eventsub.js";
import { findUserByTwitchId, updateUser } from "../../db/adapters/users.js";
import { createGPTMessage } from "../modules/openAi.js";
import { createFirstMessageLog, getFirstMessageLogByBroadcasterId } from "../../db/adapters/firstMessage.js";
import { getChannelInformation, sendShoutout } from "../modules/twitchRequest.js";
import { createRaffleEntry, deleteAllRaffleEntryByBroadcasterId, getAllRaffleEntryByBroadcasterId } from "../../db/adapters/raffle.js";
const gtotModeHandler = async (broadcaster, notification) => {
  try {
    // If feature is disabled, do nothing
    if (!broadcaster.botSettings.gtotMode.enabled) {
      return;
    }
    const moderatorsList = broadcaster.channelInfo.moderators;
    const currentUser = notification.event.chatter_user_name;
    const currentMsg = notification.event.message.text.toLowerCase();
    // Handle gtot mode toggling
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === 'enter gtot mode') {
      await updateUser(broadcaster.username, {
        botSettings: {
          gtotMode: {
            toggle: true
          }
        }
      });
      await sendMessage(notification.event.broadcaster_user_id, `Okayge`);
    }
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === 'exit gtot mode') {
      await updateUser(broadcaster.username, {
        botSettings: {
          gtotMode: {
            toggle: false
          }
        }
      });
      await sendMessage(notification.event.broadcaster_user_id, `Deadge`);
    }
    // Chat features for when gtot mode is enabled
    if (broadcaster.botSettings.gtotMode.toggle) {
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
    if (!broadcaster.botSettings.randomInsult.enabled) {
      return;
    }
    let oneIn250Chance = (Math.floor(Math.random() * 250) + 1) === 100;
    if (oneIn250Chance) {
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

const autoShoutoutHandler = async (broadcaster, notification) => {
  try {
    let broadcasterId = broadcaster.twitchUserId;
    let autoShoutoutList = broadcaster.botSettings.autoShoutout.twitchDisplayNames;
    let chatter = notification.event.chatter_user_name.toLowerCase();
    let chatterId = notification.event.chatter_user_id;
    let gtotMode = broadcaster.botSettings.gtotMode.enabled;
    let firstMessageDisplayNames = await getFirstMessageLogByBroadcasterId(broadcasterId);
    // Omit every message that 1. is not a user in the autoshoutoutlist 2. is already in the first message log
    if (!autoShoutoutList.includes(chatter) || firstMessageDisplayNames.includes(chatter)) {
      return;
    }
    if (gtotMode && broadcaster.botSettings.gtotMode.toggle) {
      await sendMessage(broadcasterId, `Yo shoutout my dawg ${chatter}`);
      return;
    }
    const { game_name } = await getChannelInformation(chatterId);
    await sendMessage(broadcasterId, `Check out ${chatter}, they are playing ${game_name} at https://twitch.tv/${chatter}`);
    await createFirstMessageLog(broadcasterId, chatter);
    await sendShoutout(broadcasterId, chatterId, broadcaster.userAccessToken.token);
  } catch (err) {
    console.log('there was an error in autoShoutoutHandler');
    throw err;
  }
}

const raffleHandler = async (broadcaster, notification) => {
  try {
    const moderatorsList = broadcaster.channelInfo.moderators;
    const broadcasterId = broadcaster.twitchUserId;
    const currentUser = notification.event.chatter_user_name;
    const currentMsg = notification.event.message.text.toLowerCase();
    const raffleOpen = broadcaster.botSettings.raffle.raffleOpen;
    // If feature is disabled, do nothing
    if (!broadcaster.botSettings.raffle.enabled) {
      return;
    }
    // If moderator or broadcaster && msg is !raffle
    // Handle opening/closing of raffle
    if ((moderatorsList.includes(currentUser) || currentUser === broadcaster.twitchDisplayName) && currentMsg === '!startlottery' && !raffleOpen) {
      // set raffleOpen in broadcaster settings to true
      await updateUser(broadcaster.username, {
        botSettings: {
          raffle: {
            raffleOpen: true
          }
        }
      });

      // Tell users raffle is open
      await sendMessage(broadcasterId, `peepoGamble ${broadcaster.twitchDisplayName} lottery is open, type !pickme to enter peepoGamble`);

      // Send warning messages at 15 seconds and 5 seconds
      setTimeout(async () => {
        await sendMessage(broadcasterId, `15 seconds left in the raffle`);
      }, 15000)

      setTimeout(async () => {
        await sendMessage(broadcasterId, `5 seconds left in the raffle`);
      }, 25000)
      // Finalize raffle outcome
      setTimeout(async () => {
        // decide raffle winner
        const allEntries = await getAllRaffleEntryByBroadcasterId(broadcasterId);
        const indexPick = Math.floor(Math.random() * (allEntries.length - 1));
        const chosenUser = allEntries[indexPick];
        // set raffleOpen in broadcaster settings to false
        await updateUser(broadcaster.username, {
          botSettings: {
            raffle: {
              raffleOpen: false
            }
          }
        });
        await deleteAllRaffleEntryByBroadcasterId(broadcasterId);
        if (chosenUser) {
          await sendMessage(broadcasterId, `peepoCheer ${chosenUser} was picked peepoCheer`);
        } else {
          await sendMessage(broadcasterId, `Nobody entered the raffle Smoge`)
        }
      }, 30000)
    }
    // Handle chatter entry to raffle
    if (raffleOpen && currentMsg === '!pickme') {
      const raffleEntries = await getAllRaffleEntryByBroadcasterId(broadcasterId);
      if (raffleEntries.includes(currentUser)) {
        return;
      }
      await createRaffleEntry(broadcasterId, currentUser);
    }
  } catch (err) {
    console.log('there was an error in raffleHandler');
    throw err;
  }
}

// This will be the parent of all message handlers
const messageHandler = async (notification) => {
  try {
    // Captures channel.chat.message events subscriptions && ignore messages sent by ourselves (i.e. messages sent by the bot)
    if (notification.subscription.type === 'channel.chat.message' && notification.event.chatter_user_login !== 'akenshi__bot') {
      const broadcaster = await findUserByTwitchId(notification.event.broadcaster_user_id);
      await autoShoutoutHandler(broadcaster, notification);
      await gtotModeHandler(broadcaster, notification);
      await raffleHandler(broadcaster, notification);
      await randomInsultHandler(broadcaster, notification);
    }
  } catch (err) {
    console.log('there was an error during the message process');
    throw err;
  }
}

export default messageHandler;