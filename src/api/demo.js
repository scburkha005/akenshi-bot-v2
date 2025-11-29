import axios from 'axios';
const { VITE_API_URL } = import.meta.env;

export async function toggleGtotMode (token) {
  try {
    let { data } = await axios({
      method: 'patch',
      url: `${VITE_API_URL}/demo/toggleGtotMode`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.log('error in api request');
    throw err;
  }
}

export async function triggerRaidEvent(token) {
  try {
    await axios({
      method: 'post',
      url: `${VITE_API_URL}/demo/raid`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.log('error while triggering raid event');
    throw err;
  }
}

export async function resetFirstMessageLogs (token) {
  try {
    await axios({
      method: "delete",
      url: `${VITE_API_URL}/demo/firstMessageLogs`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.log('error while reseting first message logs');
    throw err;
  }
}