import { Link } from "react-router";
import { useContext } from 'react';
import { AuthContext } from "../App";
function Navbar () {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  function handleLogout () {
    localStorage.removeItem('token');
    setToken('');
    setUser({});
  }

  return (
    <div className="navbar">
      <Link to="/">Home</Link> 
      { token ?
      <>
        <Link to='/account'>Account</Link> 
        <Link onClick={handleLogout}>Logout</Link> 
      </>
      : <Link to="/login">Login</Link> }
      {/* Admin Pages */}
      { user?.isAdmin && <Link to="/admin">Admin Page</Link> }
    </div>
  )
}

export default Navbar;