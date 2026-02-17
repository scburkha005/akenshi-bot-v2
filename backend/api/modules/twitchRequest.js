import axios from 'axios';
import { findUserByUsername, updateUser } from '../../db/adapters/users.js';
const { TWITCH_CLIENT_ID, TWITCH_SECRET } = process.env;

export async function getAdditionalUserInfo (userId, userAccessToken) {
  try {
    // destructuring nested structure to get to the actual "data"
    const { data: { data: [ data ] } } = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
    return data;
  } catch (err) {
    console.log('error while fetching user info from twitch');
    console.log(err)
    throw err;
  }
}

export async function getChannelModerators (broadcasterId, userAccessToken) {
  try {
    // destructuring nested structure to get to the actual "data"
    const { data: { data } } = await axios.get(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${broadcasterId}`, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
    const modsDisplayNames = data.map(moderator => moderator.user_name);
    return modsDisplayNames;
  } catch (err) {
    console.log('error while fetching mods info from twitch');
    console.log(err)
    throw err;
  }
}

export async function getChannelInformation (broadcasterId) {
  try {
    const akenshiBot = await findUserByUsername("akenshi__bot");
    const { data: { data: [ data ] } } = await axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
      headers: {
        'Authorization': `Bearer ${akenshiBot.appAccessToken.token}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
    console.log(data)
    return data;
  } catch (err) {
    console.log('error while attempting to fetch channel information')
    throw err;
  }
}

export async function sendShoutout (sendingBroadcasterId, receivingBroadcasterId, userAccessToken) {
   try {
    console.log(sendingBroadcasterId, receivingBroadcasterId, userAccessToken)
    await axios({
      method: 'post',
      url: `https://api.twitch.tv/helix/chat/shoutouts?from_broadcaster_id=${sendingBroadcasterId}&to_broadcaster_id=${receivingBroadcasterId}&moderator_id=${sendingBroadcasterId}`,
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
   } catch (err) {
    console.log("error while sending shoutout");
    console.log(err)
    throw err;
   }
}

export async function refreshOAuthToken (refreshToken, username) {
  try {
    const { data } = await axios({
      method: 'post',
      url: `https://id.twitch.tv/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_SECRET,
        grant_type: 'refresh_token',
        refresh_token: encodeURIComponent(refreshToken)
      }
    });

    await updateUser(username, {
      userAccessToken: {
        token: data.access_token,
        refreshToken: data.refresh_token
      },
      scopes: data.scope
    });

  } catch (err) {
    console.log("error while refreshing oauth token");
    throw err;
  }
}