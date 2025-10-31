import { useState } from 'react';

function AccountPage () {
  const [ eventSubs, setEventSubs ] = useState()

  async function handleEventSubs () {
    try {
      // we need to write a function that gets only the users eventsubs
      // const eventSubs = await getCurrentEventSubs(token)
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