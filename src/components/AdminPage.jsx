import BotTwitchAuth from './BotTwitchAuth';
import Subscriptions from './Subscriptions';
import { Typography } from '@mui/material';
function AdminPage () {

  return (
    <>
      <Typography variant="h4" sx={{textAlign: "center", py: 1}}>Admin page</Typography> 
      <Subscriptions />
      <BotTwitchAuth />
    </>
  );
}

export default AdminPage;