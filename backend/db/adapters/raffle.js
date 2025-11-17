import client from '../index.js';
const akenshiBotDB = client.db('akenshiBotDB');
const raffleEntriesCollection = akenshiBotDB.collection('raffle_entries');
// Schema
/*
raffle_entries {
  broadcasterId
  displayName
}
*/

export async function createRaffleEntry (broadcasterId, displayName) {
  try {
    const data = await raffleEntriesCollection.insertOne({
      broadcasterId,
      displayName
    });
    console.log(data);
  } catch (err) {
    console.log('error while creating data in raffle_entries in database');
    throw err;
  }
}

export async function deleteAllRaffleEntryByBroadcasterId (broadcasterId) {
  try {
    const data = await raffleEntriesCollection.deleteMany({ broadcasterId });
    console.log(data);
  } catch (err) {
    console.log('error while deleting data in raffle_entries with broadcaster id');
    throw err;
  }
}