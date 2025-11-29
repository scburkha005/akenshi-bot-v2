import axios from 'axios';
import express from 'express';
const apiRouter = express.Router();
import { userRouter, twitchRouter, demoRouter } from './api/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
import { createUser, findUserByTwitchId, findUserByUsername, updateUser } from './db/adapters/users.js';
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

apiRouter.use((req, res, next) => {
  res.status(404).send({
    name: "IncorrectUrl",
    message: "Page Not Found"
  })
})

export default apiRouter;