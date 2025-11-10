import { TextField, Paper, FormLabel, FormControl, Button, Box } from "@mui/material";
function AutoShoutoutForm ({ autoShoutoutEnabled }) {

  return (
    <Paper elevation={2} sx={{
      display: 'flex',
      justifyContent: 'center',
      maxWidth: 350,
      my: 2,
      mx: 1,
      opacity: autoShoutoutEnabled ? 1 : 0.25
    }}>
      <FormControl sx={{
        display: 'flex',
        alignItems: 'center',
        m: 2
      }}>
        <FormLabel sx={{mb: 1}}>Auto Shoutout Settings</FormLabel>
        <Box sx={{
          display: 'flex'
        }}>
          <TextField label="Twitch Display Name" variant="outlined" />
          <Button>Add</Button>
        </Box>
      </FormControl>
    </Paper>
  );
}

export default AutoShoutoutForm