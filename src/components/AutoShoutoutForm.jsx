import { TextField, Paper, FormLabel, FormControl, Button, Box, List, ListItem } from "@mui/material";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../App";
import { updateUser } from "../api/user";

function AutoShoutoutForm ({ autoShoutoutEnabled, setIsSnackbarOpen, setSnackbarMsg }) {
  const { user, token, setUser } = useContext(AuthContext);
  const [isChanged, setIsChanged] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [autoShoutoutList, setAutoShoutoutList] = useState([]);

  useEffect(() => {
    // Assign state after user is loaded from context
    setAutoShoutoutList(user.botSettings?.autoShoutout)
  }, [user])

  const handleAdd = async (e) => {
    try {
      e.preventDefault();
      let copyArr = [...autoShoutoutList];
      copyArr.push(inputVal);
      setAutoShoutoutList(copyArr);
      setInputVal('');
      setIsChanged(true);
    } catch (err) {
      console.log('error while adding name to autoshoutout list')
      console.log(err);
    }
  }

  const handleChange = (e) => {
    setInputVal(e.target.value)
  }

  const handleSubmit = async () => {
    try {
      let updatedUser = await updateUser(token, {
        botSettings: {
          autoShoutout: autoShoutoutList
        }
      });
      setUser(updatedUser);
      setSnackbarMsg("Changes Saved Successfully");
      setIsSnackbarOpen(true);
      setIsChanged(false);
    } catch (err) {
      console.log('error while sending changes to backend');
      console.log(err);
    }
  }

  return (
    <Paper elevation={2} sx={{
      display: 'flex',
      justifyContent: 'center',
      maxWidth: 300,
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
        <Box component='form' onSubmit={handleAdd} sx={{
          display: 'flex'
        }}>
          <TextField label="Twitch Display Name" variant="outlined" value={inputVal} onChange={handleChange}/>
          <Button type='submit'>Add</Button>
        </Box>
        <Paper sx={{mt: 2}}>
          <List sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
            {autoShoutoutList?.map(username => {
              return <ListItem key={username} sx={{
                flexBasis: 'content',
                flexGrow: 0,
                flexShrink: 0
              }}>{username}</ListItem>
            })}
          </List>
        </Paper>
        <Button disabled={!isChanged} onClick={handleSubmit}>Save Changes</Button>
      </FormControl>
    </Paper>
  );
}

export default AutoShoutoutForm