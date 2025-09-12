import { Link } from "react-router-dom";
function Navbar ({ user }) {

  return (
    <div className="navbar">
      <Link to="/login">Login</Link>
      {/* Admin Pages */}
      { user?.isAdmin && <Link to="/admin">Admin Page</Link> }
    </div>
  )
}

export default Navbar;