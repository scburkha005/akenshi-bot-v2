import './Login.css';
import { login } from '../api/user.js';
import { useState, useContext } from 'react';
import { AuthContext } from '../App.jsx';
import { Link, useNavigate } from 'react-router';

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