const { VITE_TWITCH_CLIENT_ID, VITE_STATE_STRING, VITE_BASE_URL } = import.meta.env;

function TwitchAuth () {
  let params = ['response_type=code', `&client_id=${VITE_TWITCH_CLIENT_ID}`, `&redirect_uri=${VITE_BASE_URL}`, `&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls+channel%3Abot`, `&state=${VITE_STATE_STRING}`]
  params = params.join('');
  let botParams = ['response_type=code', `&client_id=${VITE_TWITCH_CLIENT_ID}`, `&redirect_uri=https://akenshi-bot.ashagni.live`, `&scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat`, `&state=${VITE_STATE_STRING}`]
  
  return (
    <>
      <h3>It looks like you still need to link your twitch account</h3>
      <a href={`https://id.twitch.tv/oauth2/authorize?${params}`}>Authorize Twitch</a>
    </>
  );
}

export default TwitchAuth;