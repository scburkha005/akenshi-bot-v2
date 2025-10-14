import { useState } from 'react';
import { getCurrentEventSubs } from '../api/twitch';

function AccountPage ({ token }) {
  const [ eventSubs, setEventSubs ] = useState()

  async function handleEventSubs () {
    try {
      const eventSubs = await getCurrentEventSubs(token)
      console.log(eventSubs)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button onClick={handleEventSubs}>Get event subs</button>
    </>
  )
}

export default AccountPage;