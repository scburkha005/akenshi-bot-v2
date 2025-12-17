import { useState, useContext, useEffect } from 'react';
import { FormGroup, FormControl, Button, Snackbar, Paper, Box, SnackbarContent, Typography } from '@mui/material';
import { AuthContext } from '../../App.jsx';
import { updateUser } from '../../api/user.js';
import AccountSetting from './AccountSetting/AccountSetting.jsx';
import AutoShoutoutForm from './AutoShoutoutForm/AutoShoutoutForm.jsx';

function objectDeepComparison (sourceObj, changedObj, changeFound = false) {
  if (changeFound) return changeFound;
  // Check each key of the sourceObj
  // If it's value is equal to an object, recursion => sourceObj becomes the key value, changedObj should also become the key value
  // Otherwise, compare it's value to changedObj
  // If a change is found, we can immediately exit and return true, otherwise keep going
  for (const key in sourceObj) {
    let currVal = sourceObj[key];
    let compareVal = changedObj[key]
    if (typeof currVal === 'object' && !Array.isArray(currVal)) {
      changeFound = objectDeepComparison(currVal, compareVal, changeFound);
    } else {
      if (currVal !== compareVal) {
        changeFound = true;
        break;
      }
    }
  }
  return changeFound
}

function AccountPage () {
  const { user, token, setUser } = useContext(AuthContext);
  const [botSettings, setBotSettings] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    // Ensures proper data assignment on refresh after loading user from context
    setBotSettings(user?.botSettings || {});
  }, [user])

  const handleChange = (e) => {
    let setting = e.target.name;
    let value = e.target.checked;
    let newSettings = {
      ...botSettings,
      [setting]: {
        ...botSettings[setting],
        enabled: value
      }
    };
    setBotSettings(newSettings);
    setIsChanged(objectDeepComparison(user.botSettings, newSettings));
    console.log(user.botSettings)
  }

  const handleSubmit = async () => {
    try {
      let updatedUser = await updateUser(token, {
        botSettings: {
          toggle: botToggleSettings
        }
      });
      setUser(updatedUser);
      setSnackbarMsg("Changes Saved Successfully");
      setIsSnackbarOpen(true);
      setIsChanged(false);
    } catch (err) {
      setSnackbarMsg("Something went wrong...")
      setIsSnackbarOpen(true);
      console.log('error while sending update request');
      console.log(err);
    }
  }

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  }


  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      <Paper elevation={2} sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignSelf: 'flex-start',
        width: '15vw',
        minWidth: '20rem',
        my: '1rem',
        mx: {
          tablet: ".5rem"
        }
      }}>
        <FormControl sx={{
          display: 'flex',
          flexGrow: 1,
          m: '1rem'
        }}>
          <Typography sx={{ textAlign: 'center' }}>Akenshi Bot Settings</Typography>
          <FormGroup>
            {Object.keys(botSettings).map(setting => {
              return <AccountSetting key={setting} settingName={setting} setting={botSettings[setting]} handleChange={handleChange} />
            })}
            <Button disabled={!isChanged} onClick={handleSubmit}>Save Changes</Button>
            <Snackbar 
              anchorOrigin={{horizontal: 'center', vertical: 'top'}}
              open={isSnackbarOpen}
              autoHideDuration={2000}
              onClose={handleSnackbarClose}
              message={snackbarMsg}
            >
              <SnackbarContent message={snackbarMsg}/>
            </Snackbar>
          </FormGroup>
        </FormControl>
      </Paper>
      {/* <AutoShoutoutForm autoShoutoutEnabled={botToggleSettings.autoShoutout} setIsSnackbarOpen={setIsSnackbarOpen} setSnackbarMsg={setSnackbarMsg}/> */}
    </Box>
  )
}

export default AccountPage;