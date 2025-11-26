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