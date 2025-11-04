import { Link } from "react-router";
import { useContext } from 'react';
import { AuthContext } from "../App";
import { Box } from "@mui/material";
function Navbar () {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  function handleLogout () {
    localStorage.removeItem('token');
    setToken('');
    setUser({});
  }

  return (
    <Box sx={{display: 'flex', justifyContent: "space-around"}}>
      <Link to="/">Home</Link> 
      { token ?
      <>
        <Link to='/account'>Account</Link> 
        <Link onClick={handleLogout}>Logout</Link> 
      </>
      : <Link to="/login">Login</Link> }
      {/* Admin Pages */}
      { user?.isAdmin && <Link to="/admin">Admin Page</Link> }

    </Box>
  )
}

export default Navbar;