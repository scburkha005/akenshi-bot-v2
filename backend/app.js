import axios from 'axios';
import express from 'express';
const apiRouter = express.Router();
import { userRouter, twitchRouter, demoRouter } from './api/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
import { createUser, findUserByToken, findUserByTwitchId, findUserByUsername, updateUser } from './db/adapters/users.js';
import { refreshOAuthToken } from './api/modules/twitchRequest.js';
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING, HMAC_SECRET, JWT_SECRET } = process.env;


apiRouter.use(async (req, res, next) => {
  const PREFIX = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(PREFIX)) {
    const token = auth.slice(PREFIX.length);

    try {
      const { username } = jwt.verify(token, JWT_SECRET);

      if (username) {
        const user = await findUserByUsername(username);
        req.user = user;
        next();
      }
    } catch (err) {
      console.log('error during jwt auth');
      next(err);
    }
  } else {
    res.send({
      name: "Authorization Error",
      message: `Authorization token must start with ${PREFIX}`
    });
  }
});

// API Routing
apiRouter.use('/twitch', twitchRouter);
// We need to parse the body after the twitch route due to needing the raw body for signature verification on route POST /api/twitch/eventsub
apiRouter.use(express.json());
apiRouter.use('/user', userRouter);
apiRouter.use('/demo', demoRouter);

apiRouter.use(async (err, req, res, next) => {
  const { response: { data: { error, message } } } = err;
  if (res.statusCode < 400 || res.statusCode >= 500) {
    res.status(500)
  }
  console.log('An error has occured')
  console.log(error, message);
  // If the OAuth token has expired, refresh it
  if (message === "Invalid OAuth token") {
    try {
      const token = err.config.headers.Authorization.slice(7);
      const user = await findUserByToken(token);
      if (user.userAccessToken.token === token) {
        await refreshOAuthToken(user.userAccessToken.refreshToken, user.username);
      } else if (user.appAccessToken.token === token) {
        await refreshOAuthToken(user.appAccessToken.refreshToken, user.username);
      }
      message = 'token refreshed successfully';
      console.log(message);
    } catch (err) {
      console.log(err);
    }
  }

  res.send({
    name: error,
    message
  })
});

apiRouter.use((req, res, next) => {
  res.status(404).send({
    name: "IncorrectUrl",
    message: "Page Not Found"
  })
})

export default apiRouter;