import client from '../index.js';
const akenshiBotDB = client.db('akenshiBotDB');
const firstMessageLogCollection = akenshiBotDB.collection('firstmessage_logs');
// Schema
/*
firstmessage_logs {
  broadcasterId
  displayName
  expireAt new Date() TTL Expires at 6 am PST every day (This TTL is being created manually via mongosh, should this process be different?)
}
*/
export async function createFirstMessageLog (broadcasterId, displayName) {
  try {
    // Create an expiry date that is always the next day at 6 am PST
    let expireDate = new Date();
    // If the current hour is after 6 am but before midnight, add a day to the date
    if (expireDate.getHours() > 6) {
      expireDate.setDate(expireDate.getDate() + 1);
    }
    expireDate.setHours(14, 0, 0, 0);

    await firstMessageLogCollection.insertOne({
      broadcasterId,
      displayName,
      expireAt: expireDate
    });
  } catch (err) {
    console.log('error while creating a new first message log in database');
    throw err;
  }
}

export async function getFirstMessageLogByBroadcasterId (broadcasterId) {
  try {
    const data = await firstMessageLogCollection.find({ broadcasterId }).toArray();
    const firstMessageDisplayNames = data.map(firstMessage => {
      return firstMessage.displayName;
    })
    return firstMessageDisplayNames;
  } catch (err) {
    console.log('error while getting first message log by broadcaster id');
    throw err;
  }
}