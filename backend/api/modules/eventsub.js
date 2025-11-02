import { findUserByUsername } from "../../db/adapters/users.js";
import axios from 'axios';
const { TWITCH_CLIENT_ID } = process.env;
// POST Send Chat Message
export async function sendMessage (broadcasterId, message) {
	try {
    const akenshiBot = await findUserByUsername("akenshi__bot");
    // Api call returns information on whether the message was successfully sent or not
		await axios.post("https://api.twitch.tv/helix/chat/messages", {
        "broadcaster_id": broadcasterId,
        "sender_id": akenshiBot.twitchUserId,
        "message": message
			}, {
        headers: {
          'Authorization': `Bearer ${akenshiBot.appAccessToken.token}`,
          'Client-Id': TWITCH_CLIENT_ID,
          'Content-Type': 'application/json'
        }
      })
	} catch (err) {
		console.log('error while sending message', err.response.data)
	}
}