import express from 'express';
import { configDotenv } from 'dotenv';
import { getAppToken, getUserToken, validateToken } from '../modules/token.js';
import { requireUser, requireAdminUser } from './modules/requireUser.js';
import { createUser, findUserByUsername, updateUser } from '../db/adapters/users.js';
configDotenv();
const { STATE_STRING } = process.env;
const twitchRouter = express.Router();

// GET /api/twitch/accountLink
twitchRouter.post('/accountLink', requireUser, async function (req, res, next) {
	// Store code upon validation
  if (STATE_STRING === req.body.state) {
    const data = await getUserToken(req.body.code);
    const userData = await validateToken(data.access_token);
    let updatedUser = await updateUser(req.user.username, {
      twitchUserId: userData.user_id,
      twitchDisplayName: userData.login,
      userAccessToken: data.access_token,
      refreshToken: data.refresh_token,
      scopes: data.scope
    });
    // continue to create BASELINE necessary events
    // start with createChatSubscription

    res.send(updatedUser);
  } else {
    next({
      error: "Unauthorized request",
      reason: "State string doesn't match"
    })
  }
});

twitchRouter.post('/botLink', requireAdminUser, async function (req, res, next) {
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
        userAccessToken: data.access_token,
        appAccessToken: appToken,
        refreshToken: data.refresh_token,
        scopes: data.scope
      });
    } else {
      akenshi_bot = await createUser({
        username: 'akenshi__bot',
        password: null,
        isAdmin: false,
        twitchUserId: userData.user_id,
        twitchDisplayName: userData.login,
        userAccessToken: data.access_token,
        appAccessToken: appToken,
        refreshToken: data.refresh_token,
        scopes: data.scope
      });
    }
    // continue to create BASELINE necessary events
    // start with createChatSubscription

    res.send(akenshi_bot);
  } else {
    next({
      error: "Unauthorized request",
      reason: "State string doesn't match"
    })
  }
});

// Need raw message body for proper signature verification, make sure to JSON.parse() the body later so it's in a readable format
// twitchRouter.use(express.raw({
//   type: 'application/json'
// }));
export default twitchRouter;