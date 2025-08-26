import axios from 'axios';
const { VITE_API_URL } = import.meta.env;

export async function login (username, password) {
  try {
    let { data } = await axios.post(`${VITE_API_URL}/user/login`, {
      username,
      password
    });
    console.log(data)

    return data;
  } catch (err) {
    console.log('error while logging in');
    console.log(err);
  }
}