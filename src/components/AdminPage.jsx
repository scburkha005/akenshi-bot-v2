import BotTwitchAuth from './BotTwitchAuth';
import Subscriptions from './Subscriptions';
function AdminPage ({ token }) {

  return (
    <>
      <div>Admin page</div> 
      <Subscriptions token={token}/>
      <BotTwitchAuth />
    </>
  );
}

export default AdminPage;