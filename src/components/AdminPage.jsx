import BotTwitchAuth from './BotTwitchAuth';
import Subscriptions from './Subscriptions';
function AdminPage () {

  return (
    <>
      <h2>Admin page</h2> 
      <Subscriptions />
      <BotTwitchAuth />
    </>
  );
}

export default AdminPage;