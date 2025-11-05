import BotTwitchAuth from './BotTwitchAuth';
import Subscriptions from './Subscriptions';
import { Typography, Box } from '@mui/material';
function AdminPage () {

  return (
    <Box sx={{display: 'flex', flexDirection: "column", alignItems: "center"}}>
      <Typography variant="h4" sx={{textAlign: "center", py: 1}}>Admin page</Typography> 
      <Subscriptions />
      <BotTwitchAuth />
    </Box>
  );
}

export default AdminPage;