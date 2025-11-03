import { useState, useContext, useEffect } from 'react';
import { FormGroup, FormLabel, FormControl, FormControlLabel, Switch, Button } from '@mui/material';
import { AuthContext } from '../App';
import { updateUser } from '../api/user.js';

function objectComparison (sourceObj, changedObj) {
  return Object.keys(sourceObj).reduce((isChanged, key) => {
    if (sourceObj[key] !== changedObj[key]) {
      isChanged = true;
    }
    return isChanged
  }, false)
}

function AccountPage () {
  const { user, token } = useContext(AuthContext);
  const [botToggleSettings, setBotToggleSettings] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // Ensures proper data assignment on refresh after loading user from context
    setBotToggleSettings(user.botSettings?.toggle || {});
  }, [user])

  const handleChange = (e) => {
    let setting = e.target.name;
    let value = e.target.checked;
    let newSettings = {
      ...botToggleSettings,
      [setting]: value
    };
    setBotToggleSettings(newSettings);
    setIsChanged(objectComparison(user.botSettings.toggle, newSettings));
  }

  const handleSubmit = async () => {
    try {
      await updateUser(token, {
        botSettings: {
          toggle: botToggleSettings
        }
      });
    } catch (err) {
      console.log('error while sending update request');
      console.log(err);
    }
  }

  return (
    <>
    <FormControl>
      <FormLabel>Akenshi Bot Settings</FormLabel>
      <FormGroup>
        {Object.keys(botToggleSettings).map(setting => {
          return <FormControlLabel 
            key={setting}
            control={
              <Switch checked={botToggleSettings[setting]} onChange={handleChange} name={setting} />
            }
            label={setting}
          />
        })}
        <Button disabled={!isChanged} onClick={handleSubmit}>Save Changes</Button>
      </FormGroup>

    </FormControl>
    </>
  )
}

export default AccountPage;