import client from '../index.js';
const akenshiBotDB = client.db('akenshiBotDB');
const eventsubCollection = akenshiBotDB.collection('eventsub_logs');
// Schema
/*
eventsub_logs {
  broadcasterId
  createdAt new Date() TTL expireAfterSeconds 86400 (24 hours) (This TTL is being created manually via mongosh, should this process be different?)
  eventsubId
}
*/
// Create event sub
export async function createEventSubscriptionLog (broadcasterId, eventsubId) {
 try {
  await eventsubCollection.insertOne({
    broadcasterId,
    createdAt: new Date(),
    eventsubId
  });
 } catch (err) {
  console.log('error while creating event subscription log in database');
  throw err;
 }
}

export async function getEventSubscriptionLogByBroadcasterId (broadcasterId) {
  try {
    const data = await eventsubCollection.find({ broadcasterId }).toArray();
    const eventsubIdArr = data.map(eventsub => {
      return eventsub.eventsubId;
    })
    return eventsubIdArr;
  } catch (err) {
    console.log('error while getting event subscription log by broadcaster id');
    throw err;
  }
}