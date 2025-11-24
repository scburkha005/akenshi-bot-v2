import { TextField, Paper, FormLabel, FormControl, Button, Box, List, ListItem, Typography, Divider } from "@mui/material";
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

  const handleAdd = (e) => {
    e.preventDefault();
    let copyArr = [...autoShoutoutList];
    // Check to see if name already exists
    let displayName = inputVal.toLocaleLowerCase();
    if (copyArr.includes(displayName)) {
      setSnackbarMsg("User already in list");
      setIsSnackbarOpen(true);
      return;
    }
    copyArr.push(displayName);
    copyArr.sort();
    setAutoShoutoutList(copyArr);
    setInputVal('');
    setIsChanged(true);
  }

  const handleDelete = (e) => {
    e.preventDefault();
    let clickedName = event.target.innerText;
    let copyArr = [...autoShoutoutList];
    let indexToRemove = copyArr.findIndex((element) => element === clickedName);
    copyArr.splice(indexToRemove, 1);
    setAutoShoutoutList(copyArr);
    setIsChanged(true);
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
      alignSelf: 'flex-start',
      width: '15vw',
      minWidth: '20rem',
      my: '1rem',
      mx: {
        tablet: ".5rem"
      },
      opacity: autoShoutoutEnabled ? 1 : 0.25
    }}>
      <FormControl sx={{
        display: 'flex',
        alignItems: 'center',
        m: '1rem'
      }}>
        <Typography sx={{mb: 1}}>Auto Shoutout Settings</Typography>
        <Box component='form' onSubmit={handleAdd} sx={{
          display: 'flex'
        }}>
          <TextField label="Twitch Display Name" variant="outlined" value={inputVal} onChange={handleChange}/>
          <Button type='submit'>Add</Button>
        </Box>
        {autoShoutoutList?.length > 0 && <Typography variant="subtitle2" sx={{
          pt: '.5rem',
          fontStyle: "italic"
        }}>Click a name below to remove</Typography>}
        <Divider sx={{ borderColor: 'lightgrey', width: '100%', pt: '.5rem' }}></Divider>
        <Paper sx={{mt: '1rem'}}>
          <List sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
            {autoShoutoutList?.map(username => {
              return <ListItem key={username} onClick={handleDelete} sx={{
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