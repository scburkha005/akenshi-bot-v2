import { useNavigate } from "react-router";
import { useState, useContext } from "react";
import { AuthContext } from "../../App.jsx";
import { register } from "../../api/user.js";
import { Paper, Box, Typography, FormControl, FormLabel, OutlinedInput, Button, Link } from '@mui/material';

function Register () {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirm, setPasswordConfirm ] = useState('');
  const [error, setError] = useState({});
  // Storing references to state setters in an object in order to call them modularly based on string for onChange
  const setters = {
    setUsername,
    setPassword,
    setPasswordConfirm
  }

  function onChange (e) {
    let fieldType = e.target.id
    setters[`set${fieldType}`](e.target.value);
  }

  async function onRegister (e) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError({
        error: "Failed to create account",
        reason: "Passwords do not match"
      });
    } else {
      try {
        let { token } = await register(username, password);
        setToken(token);
        navigate('/');
      } catch ({ response: { data }}) {
        setError(data);
      }
    }
  }
  return (
    <>
    <Paper variant='outlined' sx={{
      p: 3,
      mt: '4rem',
      backgroundColor: "#202020",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {error?.error && <div id='error-message'>{`${error.error}: ${error.reason}`}</div>}
      <Typography variant='h4'>Sign Up</Typography>
      <Box component="form" onSubmit={onRegister} sx={{
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
        <FormControl>
          <FormLabel variant='standard' for="PasswordConfirm">Confirm Password</FormLabel>
          <OutlinedInput id="PasswordConfirm" type='password' onChange={onChange} sx={{
            height: '2.5rem',
            mt: 1,
            mb: 2
          }}/>
        </FormControl>
        <Button variant='contained' type="submit">Register</Button>
      </Box>
      <Link to='/login'>Already have an account? Sign in here</Link>
    </Paper>
    </>
  )
}

export default Register;