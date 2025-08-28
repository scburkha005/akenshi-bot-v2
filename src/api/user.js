import axios from 'axios';
const { VITE_API_URL } = import.meta.env;

export async function login (username, password) {
  try {
    let { data } = await axios.post(`${VITE_API_URL}/user/login`, {
      username,
      password
    });

    return data;
  } catch (err) {
    console.log('error while logging in');
    throw err;
  }
}

export async function register (username, password) {
  try {
    let { data } = await axios.post(`${VITE_API_URL}/user/register`, {
      username,
      password
    });
    
    return data;
  } catch (err) {
    console.log('error while registering account');
    throw err;
  }
}