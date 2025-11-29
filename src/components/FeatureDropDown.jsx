import { FormControl, InputLabel, Select, MenuItem, Typography, Paper, Button, Box, Tooltip, Divider } from "@mui/material";
import { AuthContext } from "../App";
import { useContext, useState } from "react";
import { toggleGtotMode, triggerRaidEvent } from "../api/demo";
import HelpIcon from '@mui/icons-material/Help';

function FeatureDropDown () {
  const { user, token } = useContext(AuthContext);
  const [selectedFeature, setSelectedFeature] = useState('')

  async function handleToggleGtotMode () {
    try {
      await toggleGtotMode(token)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleTriggerRaid () {
    try {
      await triggerRaidEvent(token);
    } catch (err) {
      console.log(err);
    }
  }
  const infoBoxElements = {
    gtotMode:
    <>
      <Typography>To toggle gtot mode, type "enter gtot mode" or "exit gtot mode" in your twitch chat (moderator permissions required)</Typography> 
      <Divider sx={{ my: '.6rem' }}></Divider>
      <Typography variant='overline'>While in gtot mode: </Typography> 
      <Typography component={'li'} sx={{
          pt: 1,
          ml: '1.5rem',
      }}>All shoutouts will instead be replaced with "Yo shoutout my dawg USER"</Typography>
      <Typography component={'li'} sx={{
        ml: '1.5rem'
      }}>On every user message, there is a one percent chance akenshi bot will respond with "ya mama"</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: '.5rem'
      }}>
        <Button onClick={handleToggleGtotMode}>Simulate Moderator Toggle</Button>
        <Tooltip
          title={<Typography>Simulates as if a mod had typed either "enter gtot mode" or "exit gtot mode" in the twitch chat causing the bot to switch which mode it's in</Typography>}
          placement='top'
        >
          <HelpIcon />
        </Tooltip>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: '.5rem'
      }}>
        <Button onClick={handleTriggerRaid}>Simulate Raid Event</Button>
        <Tooltip
          title={<Typography>Simulates as if the broadcaster received a raid. This functionality uses the Twitch CLI to simulate a raid. Due to the nature of the Twitch CLI, sometimes no "last streamed game" is available to be displayed in the message, as the id of the user pulled may have never streamed</Typography>}
          placement='top'
        >
          <HelpIcon />
        </Tooltip>

      </Box>
    </>,
    autoShoutout:
    // Instruct user to add their twitch account to the autoshoutout list
    // Afterwards, type in chat
    // Should we add a button to reset the 24 hour timer
    <>
      <Typography></Typography> 
    </>,
    autoShoutoutRaid:
    // Add a button to trigger a raid event to demo
    <>
      <Typography></Typography> 
    </>,
    randomInsult:
    // Should we add a button to prime or trigger this event
    // Or input field for user to directly "send" their message
    <>
      <Typography></Typography> 
    </>,
    raffle:
    // This feature requires a mod to start
    // Instruct user to use chat for this feature
    <>
      <Typography></Typography> 
    </>,
  }
  function handleChange (e) {
    setSelectedFeature(e.target.value)
  }


  return (
    <FormControl fullWidth sx={{
      maxWidth: '320px'
    }}>
      <InputLabel id='feature-dropdown-label'>Feature</InputLabel>
      <Select
        labelId='feature-dropdown-label'
        value={selectedFeature}
        onChange={handleChange}
        label="Feature"
      >
        {user.botSettings?.toggle && Object.keys(user.botSettings.toggle).map((featureName) => {
          return user.botSettings.toggle[featureName] ? <MenuItem value={featureName}>{featureName}</MenuItem> : <MenuItem disabled value={featureName}>{featureName}</MenuItem>
        })}
      </Select>
      { selectedFeature && 
        <Paper variant='outlined' sx={{
          px: '1rem',
          pt: '.5rem',
          pb: '1rem',
          textAlign: 'start'
        }}>
          <Typography variant="overline">How to use:</Typography>
          {infoBoxElements[selectedFeature]}
        </Paper> 
      }
    </FormControl>
  );
}

export default FeatureDropDown;