import client from '../index.js';
const akenshiBotDB = client.db('akenshiBotDB');
const usersCollection = akenshiBotDB.collection('users');
// Schema
/*
user {
  clientId
  userId
  displayName
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
      const data = await usersCollection.insertOne(user)
      console.log('user created', data);
    }
  } catch (err) {
    console.log(err);
  }
}
// Find User By Id
export async function findUser(userId) {
  try {
    const user = usersCollection.findOne({ userId })

    return user;
  } catch (err) {
    console.log(err);
  }
}
// Find User by Username
export async function findUserByUsername (username) {
  try {
    const user = usersCollection.findOne({ username });

    return user;
  } catch (err) {
    console.log(err);
  }
}
// Update User
export async function updateUser(userId, userUpdateObj) {
  try {
    const user = usersCollection.updateOne({ userId }, {
      $set: userUpdateObj
    });

    return user;
  } catch (err) {
    console.log(err);
  }
}