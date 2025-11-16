import express from 'express';
import { createChatSubscription } from '../../modules/subscriptions.js';
import { requireAdminUser } from '../../modules/requireUser.js';
const subscriptionRouter = express.Router();

// POST /api/twitch/subscription/renew
subscriptionRouter.post('/renew', requireAdminUser, async (req, res, next) => {
  try {
    // determine subscriptioni type and renew based on that
    let { subscriptionType, broadcasterId } = req.body
    if (subscriptionType === 'channel.chat.message') {
      await createChatSubscription(broadcasterId);
      res.send({ message: "Chat Subscription renewed successfully" });
    } else if (subscriptionType === 'channel.raid') {

    }
  } catch (err) {
    next(err);
  }
})

export default subscriptionRouter;