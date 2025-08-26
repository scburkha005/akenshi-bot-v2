import { Link } from "react-router-dom";

function Register () {
  async function onRegister (e) {
    e.preventDefault();
    let [{ value: username }, { value: password}, { value: passwordRepeat }] = e.target
    console.log(username, password, passwordRepeat)
  }
  return (
    <>
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