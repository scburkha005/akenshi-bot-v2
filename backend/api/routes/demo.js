import express from 'express';
import { sendMessage } from '../modules/eventsub.js';
import { updateUser } from '../../db/adapters/users.js';
import { requireUser } from '../modules/requireUser.js';
import { triggerRaidEvent } from '../modules/execShell.js';
import { deleteAllFirstMessageLogsByBroadcasterId } from '../../db/adapters/firstMessage.js';
import { ResponseStream } from 'openai/lib/responses/ResponseStream.js';
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
        gtotModeEnabled: !req.user.botSettings.gtotModeEnabled
      }
    });
    await sendMessage(broadcasterId, !req.user.botSettings.gtotModeEnabled ? `Gtot mode enabled: Okayge` : `Gtot mode disabled: Deadge`);

    res.send({
      message: "Gtot mode successfully toggled"
    });
  } catch (err) {
    console.log('error while toggling gtot mode for demo');
    next(err);
  }
});

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
    await deleteAllFirstMessageLogsByBroadcasterId(user.broadcasterId);
    res.send({
      message: "All first message logs cleared successfully"
    })
  } catch (err) {
    console.log('error while removing all firstmessage_logs')
  }
});

export default demoRouter;