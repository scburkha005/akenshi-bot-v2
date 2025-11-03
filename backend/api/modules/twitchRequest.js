import axios from 'axios';
const { TWITCH_CLIENT_ID } = process.env;

export async function getAdditionalUserInfo (userId, userAccessToken) {
  try {
    // destructuring nested structure to get to the actual "data"
    const { data: { data: [ data ] } } = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    });
    return [data.login, data.display_name];
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