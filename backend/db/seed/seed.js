import { client } from '../index.js';

let exampleUser = {
  id: 1231245
}

export async function seedDB() {
  try {
    const akenshiBotDB = client.db('akenshiBotDB');

    const usersCollection = akenshiBotDB.collection("users");
    const result = await usersCollection.insertOne(exampleUser);
    console.log(result)
  } catch (err) {
    console.log(err);
  }
}

seedDB();