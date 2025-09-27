// POST Send Chat Message
export async function sendMessage (user, bot, message) {
	try {
    const akenshiBot = await findUserByTwitchId("1265515088");
		const { data } = await axios.post("https://api.twitch.tv/helix/chat/messages", {
        "broadcaster_id": "187093318",
        "sender_id": akenshiBot.userId,
        "message": message
			}, {
        headers: {
          'Authorization': `Bearer ${akenshiBot.userAccessToken}`,
          'Client-Id': TWITCH_CLIENT_ID,
          'Content-Type': 'application/json'
        }
      })
    console.log(data.data)
	} catch (err) {
		console.log('error while sending message', err.response.data)
	}
}