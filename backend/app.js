import axios from 'axios';
import express from 'express';
const apiRouter = express.Router();
import { userRouter, twitchRouter } from './api/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
import { createUser, findUserByTwitchId, findUserByUsername, updateUser } from './db/adapters/users.js';
import { createHmac, verifySignatures } from './modules/hmac.js';
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING, HMAC_SECRET, JWT_SECRET } = process.env;

apiRouter.use(express.json());

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
      console.log(err);
    }
  } else {
    res.send({
      error: "Authorization Error",
      reason: `Authorization token must start with ${PREFIX}`
    });
  }
});

// API Routing
apiRouter.use('/user', userRouter);
apiRouter.use('/twitch', twitchRouter);

// POST Send Chat Message
async function sendMessage (user, bot, message) {
	try {
    const akenshiBot = await findUserByTwitchId("1265515088");
		const { data } = await axios.post("https://api.twitch.tv/helix/chat/messages", {
        "broadcaster_id": "187093318",
        "sender_id": akenshiBot.userId,
        "message": message
			}, {
        headers: {
          'Authorization': `Bearer ${akenshiBot.userAccessToken}`,
          'Client-Id': TWITCH_CLIENT_ID,
          'Content-Type': 'application/json'
        }
      })
    console.log(data.data)
	} catch (err) {
		console.log('error while sending message', err.response.data)
	}
}

// channel.chat.message subscription
// Reads chat messages that appear in a specific channel
async function handleChannelMessages () {
  try {
    
  } catch (err) {
    console.log(err);
  }
}

// Request user auth
let params = ['response_type=code', `&client_id=${TWITCH_CLIENT_ID}`, `&redirect_uri=https://akenshi-bot.ashagni.live`, `&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls+channel%3Abot`, `&state=${STATE_STRING}`]
let botParams = ['response_type=code', `&client_id=${TWITCH_CLIENT_ID}`, `&redirect_uri=https://akenshi-bot.ashagni.live`, `&scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat`, `&state=${STATE_STRING}`]
params = params.join('');
botParams = botParams.join('');


// POST localhost:3000/eventsub
apiRouter.post('/eventsub', (req, res) => {
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

apiRouter.use((req, res, next) => {
  res.status(404).send({
    error: "IncorrectUrl",
    reason: "Page Not Found"
  })
})

// temp running subscriptions here
// createChatSubscription();
// getEventSubscriptions(TWITCH_CLIENT_ID);

// Host port
// app.listen(3000, function () {
// 	console.log('Twitch auth server listening on http://localhost:3000');
// });
export default apiRouter;