import { client } from '../index.js';
import { getAppToken } from '../../api/token.js';
import { updateUser } from '../adapters/users.js';
import dotenv from 'dotenv'
dotenv.config({ path: '../../../../../etc/akenshi-bot.env' });
const { TWITCH_CLIENT_ID, TWITCH_SECRET } = process.env;

async function seedAppAccessToken () {
  try {
    console.log(TWITCH_CLIENT_ID, TWITCH_SECRET)
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