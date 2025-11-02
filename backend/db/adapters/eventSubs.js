import client from '../index.js';
const akenshiBotDB = client.db('akenshiBotDB');
const eventSubsCollection = akenshiBotDB.collection('eventSubs');
// Schema
/*
eventSubs {
  twitchUserId string // found in the response from getAllEventSubs object.data.condition.broadcaster_user_id
  subscriptions array
    each index { // This object format exactly matches a response for getting event subs with transpot and condition removed
      id string
      status string
      type string
      version string
      created_at string
      cost int
    }
}
*/
// Create event sub
export async function createSubscription () {
 try {

 } catch (err) {
  throw err;
 }
}