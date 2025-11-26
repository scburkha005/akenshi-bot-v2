import { FormControl, InputLabel, Select, MenuItem, Typography, Paper } from "@mui/material";
import { AuthContext } from "../App";
import { useContext, useState } from "react";

function FeatureDropDown () {
  const { user } = useContext(AuthContext);
  const [selectedFeature, setSelectedFeature] = useState('')

  const infoBoxElements = {
    gtotMode:
    // This feature requires a mod to activate and deactivate
    // Should we add a button to prime or trigger one percent events
    // Should we add a button to trigger a raid event to demo
    <>
      <Typography></Typography> 
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