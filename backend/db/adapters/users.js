import client from '../index.js';
import { verifyPassword, hashPassword } from '../../modules/hash.js';
import { flattenObject } from '../../modules/utility.js';
const akenshiBotDB = client.db('akenshiBotDB');
const usersCollection = akenshiBotDB.collection('users');
// Schema
/*
user {
  username string
  password string
  isAdmin bool
  twitchUserId string
  twitchLogin string
  twitchDisplayName string
  userAccessToken {
    token string
    refreshToken string
  }
  channelInfo {
    moderators array of strings 
  }
  botSettings {
    optInGtotMode boolean default false,
    gtotModeEnabled boolean default false,
    autoShoutoutEnabled boolean default true,
    autoShoutout array,
    autoShoutoutRaidEnabled boolean default true
    scopes array
  }
}
bot user {
  username string
  isAdmin bool
  twitchUserId string
  twitchLogin string
  twitchDisplayName string
  userAccessToken {
    token string
    refreshToken string
  }
  appAccessToken {
    token string
  }
  scopes array
}
*/
// Create User
export async function createUser(user) {
  try {
    if (user) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
      user.isAdmin = false;
      const data = await usersCollection.insertOne(user);
      if (data.acknowledged) {
        const createdUser = await findUserByUsername(user.username);
        console.log('Successfully created user:', createdUser);
        console.log("Creating base-level subscriptions");
        // check subscriptions and create base necessary subscriptions
        return createdUser;
      } else {
        throw {
          error: "Error creating user",
          reason: "Something went wrong while creating the user in the database"
        }
      }
    }
  } catch (err) {
    throw err;
  }
}
// Create Bot User
export async function createBotUser(user) {
  try {
    if (user) {
      user.isAdmin = false;
      const data = await usersCollection.insertOne(user)
      if (data.acknowledged) {
        const createdUser = await findUserByUsername(user.username);
        console.log('Successfully created user:', createdUser);
        return createdUser;
      } else {
        throw {
          name: "Error creating user",
          message: "Something went wrong while creating the user in the database"
        }
      }
    }
  } catch (err) {
    throw err;
  }
}
// Create Admin User
export async function createAdminUser(user) {
  try {
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    user.isAdmin = true;
    const data = await usersCollection.insertOne(user)
    if (data.acknowledged) {
      const createdUser = await findUserByUsername(user.username);
      console.log('Successfully created user:', createdUser);
      console.log("Creating base-level subscriptions");
      // check subscriptions and create base necessary subscriptions
      return createdUser;
    } else {
      throw {
        name: "Error creating user",
        message: "Something went wrong while creating the user in the database"
      }
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
export async function findUserByTwitchId (twitchUserId) {
  try {
    const user = await usersCollection.findOne({ twitchUserId });
    delete user?.password;

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
// Update User
export async function updateUser(username, userUpdateObj) {
  try {
    const flattenedObj = flattenObject(userUpdateObj);

    const user = await usersCollection.updateOne({ username }, {
      $set: flattenedObj
    });

    delete user.password;

    return user;
  } catch (err) {
    throw err;
  }
}