const axios = require('axios');
const { TWITCH_CLIENT_ID, TWITCH_SECRET, SESSION_SECRET, STATE_STRING } = process.env;
// TWITCH API REQUESTS
// POST oauth2 token
async function getToken (code) {
	try {
		const { data } = await axios.post('https://id.twitch.tv/oauth2/token', {
			client_id: TWITCH_CLIENT_ID,
			client_secret: TWITCH_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: 'http://localhost:3000'
		});
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}

// GET Validate Token
async function validateToken (access_token) {
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
async function getUser() {
	try {
		const { data } = await axios.get('https://api.twitch.tv/helix/users?login=twitchdev', {
			
		})
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
    getToken,
    validateToken,
    getUser
}