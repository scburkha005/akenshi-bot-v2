import axios from 'axios';
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING } = process.env;
// TWITCH API REQUESTS
export async function getAppToken () {
	try {
		const { data } = await axios.post('https://id.twitch.tv/oauth2/token', {
			client_id: TWITCH_CLIENT_ID,
			client_secret: TWITCH_SECRET,
			grant_type: 'client_credentials'
		})
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}
// POST oauth2 token => uses code from authorize endpoint to generate user access token
export async function getUserToken (code) {
	try {
		const { data } = await axios.post('https://id.twitch.tv/oauth2/token', {
			client_id: TWITCH_CLIENT_ID,
			client_secret: TWITCH_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: 'https://akenshi-bot.ashagni.live'
		});
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}

// GET Validate Token
export async function validateToken (access_token) {
	try {
		console.log('ACCESS TOKEN', access_token)
		const { data } = await axios.get('https://id.twitch.tv/oauth2/validate', {
			headers: {
				"Authorization": `OAuth ${access_token}`
			}
		});
		
    return data;
	} catch (err) {
		console.log(err);
	}
}
// GET User
export async function getUser() {
	try {
		const { data } = await axios.get('https://api.twitch.tv/helix/users?login=twitchdev', {
			
		})
	} catch (err) {
		console.log(err);
	}
}