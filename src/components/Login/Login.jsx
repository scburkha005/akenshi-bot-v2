import { login } from '../../api/user.js';
import { useState, useContext } from 'react';
import { AuthContext } from '../../App.jsx';
import { useNavigate } from 'react-router';
import { Paper, Box, Typography, FormControl, FormLabel, OutlinedInput, Button, Link } from '@mui/material';

function Login () {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [error, setError] = useState({});
  // Storing references to state setters in an object in order to call them modularly based on string for onChange
  const setters = {
    setUsername,
    setPassword,
  }

  function onChange (e) {
    let fieldType = e.target.id
    setters[`set${fieldType}`](e.target.value);
  }

  async function onLogin (e) {
    e.preventDefault();
    try {
      let { token } = await login(username, password);
      setToken(token);
      navigate('/');
    } catch ({ response: { data }}) {
      setError(data);
    }
  }
  return (
    <Paper variant='outlined' sx={{
      p: 3,
      mt: '4rem',
      backgroundColor: "#202020",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {error?.error && <div id='error-message'>{`${error.error}: ${error.reason}`}</div>}
      <Typography variant='h4'>Sign In</Typography>
      <Box component="form" onSubmit={onLogin} sx={{
        display: "flex",
        flexDirection: 'column',
        p: 2
      }}>
        <FormControl>
          <FormLabel variant='standard' for="Username">Username</FormLabel>
          <OutlinedInput id="Username" onChange={onChange} sx={{
            height: '2.5rem',
            mt: 1,
            mb: 2
          }}/>
        </FormControl>
        <FormControl>
          <FormLabel variant='standard' for="Password">Password</FormLabel>
          <OutlinedInput id="Password" type='password' onChange={onChange} sx={{
            height: '2.5rem',
            mt: 1,
            mb: 2
          }}/>
        </FormControl>
        <Button variant='contained' type="submit">Login</Button>
      </Box>
      <Link to='/register'>Don't have an account? Sign up here</Link>
    </Paper>
  );
}

export default Login;