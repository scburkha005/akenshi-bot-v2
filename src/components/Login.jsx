import { login } from '../api/user.js';
import { useState, useContext } from 'react';
import { AuthContext } from '../App.jsx';
import { useNavigate } from 'react-router';
import { Paper, Box, Typography, FormControl, FormLabel, OutlinedInput, Button, Link } from '@mui/material';

function Login () {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  let [error, setError] = useState({});

  async function onLogin (e) {
    e.preventDefault();
    let [{ value: username }, { value: password}] = e.target
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
      backgroundColor: "#202020"
    }}>
      {error?.error && <div id='error-message'>{`${error.error}: ${error.reason}`}</div>}
      <Typography variant='h4'>Sign In</Typography>
      <Box component="form" onSubmit={onLogin} sx={{
        display: "flex",
        flexDirection: 'column',
        p: 2
      }}>
        <FormControl>
          <FormLabel variant='standard' for="username">Username</FormLabel>
          <OutlinedInput id="username" sx={{
            height: '2.5rem',
            mt: 1,
            mb: 2
          }}/>
        </FormControl>
        <FormControl>
          <FormLabel variant='standard' for="password">Password</FormLabel>
          <OutlinedInput id="password" type='password' sx={{
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