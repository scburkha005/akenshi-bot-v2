import './Login.css';
import { login } from '../api/user.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login ({ setToken }) {
  let [error, setError] = useState({});

  async function onLogin (e) {
    e.preventDefault();
    let [{ value: username }, { value: password}] = e.target
    let result = await login(username, password);
    if (result.error) {
      setError(result);
      console.log(result)
    } else {
      setToken(result.token);
    }
  }
  return (
    <>
      {error?.error && <div id='error-message'>{`${error.error}: ${error.reason}`}</div>}
      <form id="login-form" onSubmit={onLogin}>
        <label>Username: </label>
        <input />
        <label>Password: </label>
        <input />
        <button type="submit">Login</button>
      </form>
      <Link to='/register'>Don't have an account? Sign up!</Link>
    </>
  );
}

export default Login;