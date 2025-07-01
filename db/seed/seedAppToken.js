const { client } = require('../index.js');
const { getAppToken } = require('../../bot-main/api/token.js');
const { updateUser } = require('../adapters/users.js');
require('dotenv').config({ path: '../../.env' });
const { TWITCH_CLIENT_ID, TWITCH_SECRET } = process.env;

async function seedAppAccessToken () {
  try {
    let { access_token: appAccessToken } = await getAppToken(TWITCH_CLIENT_ID, TWITCH_SECRET);
    let user = await updateUser("1265515088", {
      appAccessToken
    })
    console.log("finished updating user", user);
  } catch (err) {
    console.log('error seeding app access token', err);
  }
}

seedAppAccessToken();