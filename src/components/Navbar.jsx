import { Link } from "react-router-dom";
function Navbar () {

  return (
    <div className="navbar">
      <Link to="/login">Login</Link>
    </div>
  )
}

export default Navbar;