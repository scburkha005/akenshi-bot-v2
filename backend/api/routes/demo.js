import express from 'express';
import { sendMessage } from '../modules/eventsub.js';
import { updateUser } from '../../db/adapters/users.js';
import { requireUser } from '../modules/requireUser.js';
import { triggerRaidEvent } from '../modules/execShell.js';
import { deleteAllFirstMessageLogsByBroadcasterId } from '../../db/adapters/firstMessage.js';
import { deleteAllRaffleEntryByBroadcasterId, getAllRaffleEntryByBroadcasterId } from "../../db/adapters/raffle.js";
const { HMAC_SECRET } = process.env;
const demoRouter = express.Router();

// PATCH /api/demo/toggleGtotMode
demoRouter.patch('/toggleGtotMode', requireUser, async (req, res, next) => {
  try {
    let broadcasterUsername = req.user.username;
    let broadcasterId = req.user.twitchUserId;
    await sendMessage(broadcasterId, `Simulating message received to enter/exit gtot mode`);
    await updateUser(broadcasterUsername, {
      botSettings: {
        gtotMode: {
          toggle: !req.user.botSettings.gtotMode.toggle
        }
      }
    });
    await sendMessage(broadcasterId, !req.user.botSettings.gtotMode.toggle ? `Gtot mode enabled: Okayge` : `Gtot mode disabled: Deadge`);

    res.send({
      message: "Gtot mode successfully toggled"
    });
  } catch (err) {
    console.log('error while toggling gtot mode for demo');
    next(err);
  }
});

// PATCH /api/demo/startRaffle
demoRouter.patch('/startRaffle', requireUser, async (req, res, next) => {
  try {
    let broadcaster = req.user
    let broadcasterId = req.user.twitchUserId;
    await sendMessage(broadcasterId, `Simulating start raffle: !startlottery`);

    // Open raffle
    await updateUser(broadcaster.username, {
      botSettings: {
        raffleOpen: true
      }
    });
    // Tell users raffle is open
    await sendMessage(broadcasterId, `peepoGamble ${broadcaster.twitchDisplayName} lottery is open, type !pickme to enter peepoGamble`);
    // Send warning messages at 15 seconds and 5 seconds
    setTimeout(async () => {
      await sendMessage(broadcasterId, `15 seconds left in the raffle`);
    }, 15000);

    setTimeout(async () => {
      await sendMessage(broadcasterId, `5 seconds left in the raffle`);
    }, 25000);
    // Finalize raffle outcome
    setTimeout(async () => {
      // decide raffle winner
      const allEntries = await getAllRaffleEntryByBroadcasterId(broadcasterId);
      const indexPick = Math.floor(Math.random() * (allEntries.length - 1));
      const chosenUser = allEntries[indexPick];
      // set raffleOpen in broadcaster settings to false
      await updateUser(broadcaster.username, {
        botSettings: {
          raffleOpen: false
        }
      });
      await deleteAllRaffleEntryByBroadcasterId(broadcasterId);
      if (chosenUser) {
        await sendMessage(broadcasterId, `peepoCheer ${chosenUser} was picked peepoCheer`);
      } else {
        await sendMessage(broadcasterId, `Nobody entered the raffle Smoge`)
      }
    }, 30000);

    res.send({
      message: "Raffle started successfully"
    });
  } catch (err) {
    console.log('error while simulating raffle start');
    next(err);
  }
})

// POST /api/demo/raid
demoRouter.post('/raid', requireUser, async (req, res, next) => {
  try {
    let broadcasterId = req.user.twitchUserId;
    triggerRaidEvent(HMAC_SECRET, broadcasterId)
    res.send({
      message: "Raid triggered successfully for demo"
    });
  } catch (err) {
    console.log('error while simulating raid in demo');
    next(err);
  }
});

demoRouter.delete('/firstMessageLogs', requireUser, async (req, res, next) => {
  try {
    await deleteAllFirstMessageLogsByBroadcasterId(req.user.twitchUserId);
    res.send({
      message: "All first message logs cleared successfully"
    })
  } catch (err) {
    console.log('error while removing all firstmessage_logs')
  }
});

export default demoRouter;