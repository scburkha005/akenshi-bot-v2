const { VITE_TWITCH_CLIENT_ID, VITE_STATE_STRING, VITE_BASE_URL } = import.meta.env;

function TwitchAuth () {
  let botParams = ['response_type=code', `&client_id=${VITE_TWITCH_CLIENT_ID}`, `&redirect_uri=${VITE_BASE_URL}`, `&scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat`, `&state=${VITE_STATE_STRING}`]
  botParams = botParams.join('');
  
  return (
    <>
      <h3>Authorize Bot Account Below</h3>
      <a href={`https://id.twitch.tv/oauth2/authorize?${botParams}`}>Authorize Twitch</a>
    </>
  );
}

export default TwitchAuth;