import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../App";
import { getAllEventSubs } from "../api/twitch";
import { getUserById } from "../api/user";
import Subscription from "./Subscription";
function Subscriptions () {
  const [ subscriptions, setSubscriptions ] = useState([]);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    async function handleFetch () {
      try {
        let data = await getAllEventSubs(token);
        // Filter out unique broadcaster ids
        let broadcasterIds = data.data.reduce((arr, subscription) => {
          if (!arr.includes(subscription.condition.broadcaster_user_id)) {
            return [ ...arr, subscription.condition.broadcaster_user_id]
          }
          return arr;
        }, []);
        // Search for twitch username by those ids
        let broadcasterIdNamePair = await broadcasterIds.reduce(async (obj, broadcasterId) => {
          let data = await getUserById(broadcasterId, token);
          obj[broadcasterId] = data.twitchDisplayName
          return obj;
        }, {});
        // Add that username to every subscription for easier viewing
        let subscriptions = data.data.map(subscription => {
          subscription.condition.twitchUsername = broadcasterIdNamePair[subscription.condition.broadcaster_user_id];
          return subscription;
        })
        console.log(subscriptions)
        setSubscriptions(subscriptions);
      } catch (err) {
        console.log(err);
      }
    }
    handleFetch();
  }, []);

  function updateSubscriptions (subscriptionId) {
    let newSubscriptions = subscriptions.filter(subscription => {
      return subscription.id !== subscriptionId;
    });
    setSubscriptions(newSubscriptions);
  }

  return (
    <>
      {subscriptions.map(subscription => {
        return <Subscription key={subscription.id} subscription={subscription} updateSubscriptions={updateSubscriptions}/>
      })}
    </>
  )
}

export default Subscriptions;