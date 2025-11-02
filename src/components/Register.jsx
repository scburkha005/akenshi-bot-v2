import { Link, useNavigate } from "react-router";
import { useState, useContext } from "react";
import { AuthContext } from "../App.jsx";
import { register } from "../api/user.js";

function Register () {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  let [error, setError] = useState({});

  async function onRegister (e) {
    e.preventDefault();
    let [{ value: username }, { value: password}, { value: passwordRepeat }] = e.target
    if (password !== passwordRepeat) {
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
      {error?.error && <div id='error-message'>{`${error.error}: ${error.reason}`}</div>}
      <form id="login-form" onSubmit={onRegister}>
        <label>Username: </label>
        <input />
        <label>Password: </label>
        <input />
        <label>Confirm Password: </label>
        <input />
        <button type="submit">Register</button>
      </form>
      <Link to='/login'>Already have an account? Login up!</Link>
    </>
  )
}

export default Register;