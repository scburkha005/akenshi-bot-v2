const { VITE_TWITCH_CLIENT_ID, VITE_STATE_STRING, VITE_BASE_URL } = import.meta.env;

function TwitchAuth () {
  // Input scopes into the array following the format of the twitch api docs, code will reformat to a params readable format
  let scopes = ['channel:manage:polls', 'channel:read:polls', 'channel:bot', 'moderation:read'].join("+").replace(":", "%3A");
  let params = ['response_type=code', `&client_id=${VITE_TWITCH_CLIENT_ID}`, `&redirect_uri=${VITE_BASE_URL}`, `&scope=${scopes}`, `&state=${VITE_STATE_STRING}`]
  params = params.join('');
  
  return (
    <>
      <h3>It looks like you still need to link your twitch account</h3>
      <a href={`https://id.twitch.tv/oauth2/authorize?${params}`}>Authorize Twitch</a>
    </>
  );
}

export default TwitchAuth;