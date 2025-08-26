import './Login.css';
import { login } from '../api/user.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login () {
  let [user, setUser] = useState({});

  async function onLogin (e) {
    e.preventDefault();
    let [{ value: username }, { value: password}] = e.target
    let result = await login(username, password);
    setUser(result);
    console.log(result)
  }
  return (
    <>
      {user?.error && <div id='error-message'>{`${user.error}: ${user.reason}`}</div>}
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