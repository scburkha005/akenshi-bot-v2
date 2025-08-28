import { Link } from "react-router-dom";
import { useState } from "react";
import { register } from "../api/user.js";

function Register ({ setToken }) {
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
      let result = await register(username, password);
      if (result?.error) {
        setError(result);
      } else {
        setToken(result.token);
      }
    }
    console.log(username, password, passwordRepeat)
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