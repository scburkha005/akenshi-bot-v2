import client from '../index.js';
import { verifyPassword, hashPassword } from '../../modules/hash.js';
const akenshiBotDB = client.db('akenshiBotDB');
const usersCollection = akenshiBotDB.collection('users');
// Schema
/*
user {
  twitchClientId
  twitchUserId
  twitchDisplayName
  userAccessToken
  appAccessToken
  refreshToken
  scopes
}
*/
// Create User
export async function createUser(user) {
  try {
    if (user) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
      const data = await usersCollection.insertOne(user)
      console.log('Successfully created user:', data);
      return data;
    }
  } catch (err) {
    throw err;
  }
}
// Used for login verification
export async function userLogin (username, password) {
  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return;
    }

    let isValid = await verifyPassword(password, user?.password);

    if (isValid) {
      delete user.password;
      return user;
    }
  } catch (err) {
    throw err;
  }
}
// Find User by Username
export async function findUserByUsername (username) {
  try {
    const user = await usersCollection.findOne({ username });

    delete user?.password;
    return user;
  } catch (err) {
    throw err;
  }
}
// Find User by Id
export async function findUserByTwitchId (twitchId) {
  try {
    // update this in the future from userId to twitchUserId
    const user = await usersCollection.findOne({ userId: twitchId });

    return user;
  } catch (err) {
    throw err;
  }
}
// Update User
export async function updateUser(userId, userUpdateObj) {
  try {
    const user = await usersCollection.updateOne({ userId }, {
      $set: userUpdateObj
    });

    return user;
  } catch (err) {
    throw err;
  }
}