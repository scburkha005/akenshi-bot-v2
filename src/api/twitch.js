import axios from 'axios';
const { VITE_API_URL } = import.meta.env;

export async function linkAccount (code, state, token) {
  try {
    let { data } = await axios.post(`${VITE_API_URL}/twitch/accountLink`, {
      code,
      state
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return data;
  } catch (err) {
    console.log('error while linking account');
    throw err;
  }
}

export async function linkBotAccount (code, state, token) {
  try {
    let { data } = await axios.post(`${VITE_API_URL}/twitch/botLink`, {
      code,
      state
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return data;
  } catch (err) {
    console.log('error while linking account');
    throw err;
  }
}

export async function getAllEventSubs (token) {
  try {
    let { data } = await axios.get(`${VITE_API_URL}/twitch/eventsub`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(data)
    return data;
  } catch (err) {
    console.log('error while getting current event subs');
    throw err;
  }
}