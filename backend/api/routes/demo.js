import express from 'express';
import { sendMessage } from '../modules/eventsub.js';
import { updateUser } from '../../db/adapters/users.js';
import { requireUser } from '../modules/requireUser.js';
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
    await sendMessage(broadcasterId, !req.user.botSettings.gtotModeEnabled ? `Gtot mode disabled: Deadge` : `Gtot mode enabled: Okayge`);

  } catch (err) {
    console.log('error while toggling gtot mode for demo');
    next(err);
  }
})

export default demoRouter;