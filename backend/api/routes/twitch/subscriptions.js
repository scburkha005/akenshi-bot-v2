import express from 'express';
import { createChatSubscription } from '../../modules/subscriptions.js';
import { requireAdminUser } from '../../modules/requireUser.js';
const subscriptionRouter = express.Router();

// POST /api/twitch/subscription/renew
subscriptionRouter.post('/renew', requireAdminUser, async (req, res, next) => {
  try {
    await createChatSubscription(req.body.broadcasterUserId);
    res.send({ message: "Chat Subscription renewed successfully" });
  } catch (err) {
    next(err);
  }
})

export default subscriptionRouter;