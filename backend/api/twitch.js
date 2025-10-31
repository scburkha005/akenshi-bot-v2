import express from 'express';
import { configDotenv } from 'dotenv';
import { getAppToken, getUserToken, validateToken } from '../modules/token.js';
import { requireUser, requireAdminUser } from './modules/requireUser.js';
import { createBotUser, findUserByUsername, updateUser, findUserByTwitchId } from '../db/adapters/users.js';
import { createHmac, verifySignatures } from './modules/hmac.js';
import { sendMessage } from './modules/eventsub.js';
import { deleteSubscriptionById, getAllEventSubscriptions } from './modules/subscriptions.js';
configDotenv();
const { HMAC_SECRET, STATE_STRING } = process.env;
const twitchRouter = express.Router();

// GET /api/twitch/eventsub
twitchRouter.get('/eventsub', requireAdminUser, async (req, res, next) => {
  try {
    let data = await getAllEventSubscriptions();
    res.send(data);
  } catch (err) {
    console.log(err);
    next(err);
  }
})

// POST /api/twitch/eventsub
twitchRouter.post('/eventsub', (req, res) => {
  // Notification Events
  // Create our own HMAC sig to compare our signature to the one provided by twitch
  const HMAC_MSG = `${req.headers["twitch-eventsub-message-id"]}${req.headers["twitch-eventsub-message-timestamp"]}${req.body}`
  let HMAC_SIG = 'sha256=' + createHmac(HMAC_SECRET, HMAC_MSG);
  if(verifySignatures(HMAC_SIG, req.headers['twitch-eventsub-message-signature'])) {
    let notification = JSON.parse(req.body);
    // Handle notification
    if (req.headers["twitch-eventsub-message-type"] === 'notification') {
      console.log('notification running')
      console.log(notification)
      // Captures message events
      if (notification.subscription.type === 'channel.chat.message') {
        sendMessage( 'placeholder', 'placeholder', `${notification.event.broadcaster_user_name} said ${notification.event.message.text}`);
      }
      res.sendStatus(204);
    } else if (req.headers["twitch-eventsub-message-type"] = 'webhook_callback_verification') {
      console.log('webhook callback verification running')
      // Respond to the challenge request to enable our subscription
      res.set('Content-Type', 'text/plain').status(200).send(notification.challenge);
    } else if (req.headers["twitch-eventsub-message-type"] = 'revocation') {
      res.sendStatus(204);
      
      console.log(`${notification.subscription.type} notifications revoked`);
      console.log(`reason: ${notification.subscription.status}`);
      console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
    }
  } else {
    console.log('There was an issue matching signatures: Signature verification returned false');
    res.sendStatus(403);
  }
});

// DELETE /api/twitch/eventsub/:id
twitchRouter.delete('/eventsub/:id', requireAdminUser, async function (req, res, next) {
  try {
    let subscriptionId = req.params.id;
    await deleteSubscriptionById(subscriptionId);
    res.send('success')
  } catch (err) {
    next(err);
  }
});

// POST /api/twitch/accountLink
twitchRouter.post('/accountLink', requireUser, async function (req, res, next) {
  try {
    // Store code upon validation
    if (STATE_STRING === req.body.state) {
      const data = await getUserToken(req.body.code);
      const userData = await validateToken(data.access_token);

      getUserByTwitchId(userData.user_id);
      let updatedUser = await updateUser(req.user.username, {
        twitchUserId: userData.user_id,
        twitchDisplayName: userData.login,
        userAccessToken: {
          token: data.access_token,
          refreshToken: data.refresh_token,
        },
        scopes: data.scope
      });
      // continue to create BASELINE necessary events
      // start with createChatSubscription

      res.send(updatedUser);
    } else {
      next({
        name: "Unauthorized request",
        message: "State string doesn't match"
      })
    }
  } catch (err) {
    next(err);
  }
});
// POST /api/twitch/botLink
twitchRouter.post('/botLink', requireAdminUser, async function (req, res, next) {
  try {
    // Store code upon validation
    if (STATE_STRING === req.body.state) {
      const data = await getUserToken(req.body.code);
      const userData = await validateToken(data.access_token);
      const appToken = await getAppToken();

      let akenshi_bot = await findUserByUsername('akenshi__bot');
      if (akenshi_bot) {
        akenshi_bot = await updateUser('akenshi__bot', {
          twitchUserId: userData.user_id,
          twitchDisplayName: userData.login,
          userAccessToken: {
            token: data.access_token,
            refreshToken: data.refresh_token,
          },
          appAccessToken: {
            token: appToken.access_token,
          },
          scopes: data.scope
        });
      } else {
        akenshi_bot = await createBotUser({
          username: 'akenshi__bot',
          twitchUserId: userData.user_id,
          twitchDisplayName: userData.login,
          userAccessToken: {
            token: data.access_token,
            refreshToken: data.refresh_token,
          },
          appAccessToken: {
            token: appToken.access_token,
          },
          scopes: data.scope
        });
      }
      res.send({ message: "successfully linked bot account"});
    } else {
      next({
        name: "Unauthorized request",
        message: "State string doesn't match"
      })
    } 
  } catch (err) {
    next(err);
  }
});

// Need raw message body for proper signature verification, make sure to JSON.parse() the body later so it's in a readable format
// twitchRouter.use(express.raw({
//   type: 'application/json'
// }));
export default twitchRouter;