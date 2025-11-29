import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../../App";
import { getAllEventSubs } from "../../../api/twitch";
import { getUserById } from "../../../api/user";
import Subscription from "./Subscription/Subscription";
import { Box } from "@mui/material";
function Subscriptions () {
  const [ subscriptions, setSubscriptions ] = useState([]);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    async function handleFetch () {
      try {
        let data = await getAllEventSubs(token);
        // Filter out unique broadcaster ids
        let broadcasterIds = data.data.reduce((arr, subscription) => {
          let broadcasterId = subscription.condition.broadcaster_user_id || subscription.condition.to_broadcaster_user_id;
          if (!arr.includes(broadcasterId)) {
            return [ ...arr, broadcasterId];
          }
          return arr;
        }, []);
        // Search for twitch username by those ids
        let broadcasterIdNamePair = {};
        for (let i = 0; i < broadcasterIds.length; i++) {
          let broadcasterId = broadcasterIds[i];
          let data = await getUserById(broadcasterId, token);
          broadcasterIdNamePair[broadcasterId] = data.twitchDisplayName;
        }
        // Add that username to every subscription for easier viewing
        let subscriptions = data.data.map(subscription => {
          subscription.condition.twitchUsername = broadcasterIdNamePair[subscription.condition.broadcaster_user_id || subscription.condition.to_broadcaster_user_id];
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
    <Box sx={{display: 'flex', justifyContent: "center", flexWrap: "wrap"}}>
      {subscriptions.map(subscription => {
        return <Subscription key={subscription.id} subscription={subscription} updateSubscriptions={updateSubscriptions}/>
      })}
    </Box>
  )
}

export default Subscriptions;