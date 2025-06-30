const { client } = require('../index.js');
const { getAppToken } = require('../../bot-main/api/token.js');
require('dotenv').config({ path: '../../.env' });
const { TWITCH_CLIENT_ID, TWITCH_SECRET } = process.env;

async function seedAppAccessToken () {
  try {
    let appAccessToken = await getAppToken(TWITCH_CLIENT_ID, TWITCH_SECRET);
    console.log(appAccessToken);
  } catch (err) {
    console.log(err);
  }
}

seedAppAccessToken();