const axios = require('axios');
const express = require('express');
const crypto = require('crypto')
require('dotenv').config();
const { createUser, findUser, updateUser } = require('../db/adapters/users');
const { getToken, validateToken } = require('./api/token')
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING, HMAC_SECRET } = process.env;
const app = express();

// POST Send Chat Message
async function sendMessage (user, bot, message) {
	try {
    const akenshiBot = await findUser("1265515088")
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
let params = ['response_type=code', `&client_id=${TWITCH_CLIENT_ID}`, `&redirect_uri=http://localhost:3000`, `&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls+channel%3Abot+user%3Awrite%3Achat+user%3Aread%3Achat`, `&state=${STATE_STRING}`]
let botParams = ['response_type=code', `&client_id=${TWITCH_CLIENT_ID}`, `&redirect_uri=http://localhost:3000`, `&scope=channel%3Abot`, `&state=${STATE_STRING}`]
params = params.join('')

app.get('/', async function (req, res) {
	// Store code upon validation
	if (req.query.code && req.query.state === STATE_STRING) {
		console.log(req.query)
    // We don't want to get a token if we have a token
    // Does getting a new token invalidate the old token?
		const data = await getToken(req.query.code);
		const userData = await validateToken(data.access_token);
    const user = await findUser(userData.user_id);
    console.log('database', user)
    if (user) {
      console.log('updating user');
      await updateUser(userData.user_id, data.access_token, data.refresh_token, userData.scopes);
    } else {
      console.log('didnt find user');
      let user = {
        clientId: userData.client_id,
        userId: userData.user_id,
        displayName: userData.login,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scopes: userData.scopes
      }
      await createUser(user);
    }
		// if find user do nothing
		// if no find user, createuser	
	} else {
		console.log("Ah shit somebody hacking");
	}
	res.send(`<html><a href="https://id.twitch.tv/oauth2/authorize?${params}">Click here to auth the bot</a><a href="https://id.twitch.tv/oauth2/authorize?${botParams}">Click here as BOT ACCOUNT ONLY</a></html>`)
});

// POST localhost:3000/eventsub
app.post('/eventsub', (req, res) => {
  // Steps for security / auth CRYPTOJS? jscrypto
  // 1. Get Secret from env file (this is used for encryption/decryption)
  // 2. Create a string that combines data in the req (TWITCH_MESSAGE_ID + TWITCH_MESSAGE_TIMESTAMP + "message?")
  // 3. Hash our secret + message using a library, (potentially prepend sha256= to this result)
  // 4. verify the message using the library to check our hashed secret against the TWITCH_MESSAGE_SIGNATURE
  console.log(req.headers)
  res.sendStatus(204);
});


// Host port
app.listen(3000, function () {
	console.log('Twitch auth server listening on http://localhost:3000');
});