const axios = require('axios');
const express = require('express');
const jws = require('jws');
require('dotenv').config();
const { createUser, findUser, updateUser } = require('../db/adapters/users');
const { getUserToken, validateToken } = require('./api/token')
const { createHmac, verifySignatures } = require('./modules/hmac');
const { createChatSubscription } = require('./modules/subscriptions');
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING, HMAC_SECRET } = process.env;
const app = express();
// POST Send Chat Message
async function sendMessage (user, bot, message) {
	try {
    const akenshiBot = await findUser("1265515088");
    console.log(user)
		const { data } = await axios.post("https://api.twitch.tv/helix/chat/messages", {
        "broadcaster_id": "187093318",
        "sender_id": akenshiBot.userId,
        "message": 'Hello world'
			}, {
        headers: {
          'Authorization': `Bearer ${akenshiBot.accessToken}`,
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
let params = ['response_type=code', `&client_id=${TWITCH_CLIENT_ID}`, `&redirect_uri=http://localhost:3000`, `&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls+channel%3Abot`, `&state=${STATE_STRING}`]
let botParams = ['response_type=code', `&client_id=${TWITCH_CLIENT_ID}`, `&redirect_uri=http://localhost:3000`, `&scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat`, `&state=${STATE_STRING}`]
params = params.join('');
botParams = botParams.join('');

// Need raw message body for proper signature verification, make sure to JSON.parse() the body later so it's in a readable format
app.use(express.raw({
  type: 'application/json'
}));

app.get('/', async function (req, res) {
	// Store code upon validation
	if (req.query.code && req.query.state === STATE_STRING) {
		console.log(req.query)
    // We don't want to get a token if we have a token
    // Does getting a new token invalidate the old token?
		const data = await getUserToken(req.query.code);
		const userData = await validateToken(data.access_token);
    const user = await findUser(userData.user_id);
    console.log('database', user);
    if (user) {
      console.log('updating user');
      await updateUser(userData.user_id, { 
        accessToken: data.access_token, 
        refreshToken: data.refresh_token, 
        scopes: userData.scopes 
      });
    } else {
      console.log('didnt find user');
      let user = {
        clientId: userData.client_id,
        userId: userData.user_id,
        displayName: userData.login,
        userAccessToken: data.access_token,
        appAccessToken: "",
        refreshToken: data.refresh_token,
        scopes: userData.scopes
      }
      await createUser(user);
    }
	} else {
		console.log("Ah shit somebody hacking");
	}

	res.send(`<html><a href="https://id.twitch.tv/oauth2/authorize?${params}">Click here to auth the bot</a><a href="https://id.twitch.tv/oauth2/authorize?${botParams}">Click here as BOT ACCOUNT ONLY</a></html>`)
});

// POST localhost:3000/eventsub
app.post('/eventsub', (req, res) => {
  // Challenge Events
  // if (req.headers["twitch-eventsub-message-type"] === "webhook_callback_verification") {
  //   console.log(req)
  //   // res.set('Content-Type', 'text/plain').status(200).send(req.body.notification.challenge);
  // }

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

// temp running subscriptions here
createChatSubscription();

// Host port
app.listen(3000, function () {
	console.log('Twitch auth server listening on http://localhost:3000');
});