const { client } = require('../index')
const akenshiBotDB = client.db('akenshiBotDB');
const usersCollection = akenshiBotDB.collection('users');
// Schema
/*
user {
  clientId
  userId
  displayName
  accessToken
  refreshToken
}
*/
// Create User
async function createUser(user) {
  try {
    if (user) {
      const data = await usersCollection.insertOne(user)
      console.log('user created', data);
    }
  } catch (err) {
    console.log(err);
  }
}
// Find User
async function findUser(userId) {
  try {
    const user = usersCollection.findOne({ userId })

    return user;
  } catch (err) {
    console.log(err);
  }
}
// Find User
async function updateUser(userId, accessToken, refreshToken, scopes) {
  try {
    const user = usersCollection.updateOne({ userId }, {
      $set: {
        accessToken,
        refreshToken,
        scopes
      }
    })

    return user;
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  createUser,
  findUser,
  updateUser
}