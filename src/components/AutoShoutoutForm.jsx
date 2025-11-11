import { TextField, Paper, FormLabel, FormControl, Button, Box, List, ListItem } from "@mui/material";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../App";

function AutoShoutoutForm ({ autoShoutoutEnabled }) {
  const { user, token, setUser } = useContext(AuthContext);
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
    } catch (err) {
      console.log('error while adding name to autoshoutout list')
      console.log(err);
    }
  }

  const handleChange = (e) => {
    setInputVal(e.target.value)
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
            {autoShoutoutList.map(username => {
              return <ListItem key={username} sx={{
                flexBasis: 'content',
                flexGrow: 0,
                flexShrink: 0
              }}>{username}</ListItem>
            })}
          </List>
        </Paper>
      </FormControl>
    </Paper>
  );
}

export default AutoShoutoutForm