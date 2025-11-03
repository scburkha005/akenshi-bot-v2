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

export async function getUser (token) {
  try {
    let { data } = await axios.get(`${VITE_API_URL}/user/myuser`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return data;
  } catch (err) {
    console.log('error while getting user');
    throw err;
  }
}

export async function getUserById (twitchUserId, token) {
  try {
    let { data } = await axios.get(`${VITE_API_URL}/user/${twitchUserId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return data;
  } catch (err) {
    console.log('error while fetching user by id');
    throw err;
  }
}

export async function updateUser (token, updateObj) {
  // updateObj does NOT need to contain all fields, but DOES require to follow the user object format from the root
  // Example: to update the toggleable bot settings, we must pass an updateObj = {
  //   botSettings: {
  //     toggle: {
  //       gtotMode: true
  //     }
  //   }
  // }
  try {
    let { data } = await axios.patch(`${VITE_API_URL}/user`, updateObj, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  } catch (err) {
    console.log('error while updating user');
    throw err;
  }
}