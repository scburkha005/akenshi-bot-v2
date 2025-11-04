import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { deleteEventSubById } from '../api/twitch';
import { useContext } from 'react';
import { AuthContext } from '../App';
function Subscription ({ subscription, updateSubscriptions }) {
  const { token } = useContext(AuthContext);

  async function handleClick () {
    try {
      await deleteEventSubById(subscription.id, token);
      updateSubscriptions(subscription.id);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Card sx={{m: 1}}>
      <CardContent sx={{ minWidth: 275 }}>
        <Typography>
          {subscription.condition.twitchUsername}
        </Typography>
        <Typography>
          {subscription.type}
        </Typography>
        <Typography>
          {subscription.status}
        </Typography>
        <CardActions>
          <Button onClick={handleClick}>Delete Subscription</Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}

export default Subscription;