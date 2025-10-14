import { Link } from "react-router-dom";
function Navbar ({ user, token, setToken, setUser }) {
  function handleLogout () {
    localStorage.removeItem('token');
    setToken('');
    setUser({});
  }

  return (
    <div className="navbar">
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