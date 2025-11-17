import { useContext, useState } from 'react';
import { AuthContext } from "../App";
import { Box, Link, AppBar, Toolbar, IconButton, Drawer, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
function Navbar () {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home')
  function handleLogout () {
    localStorage.removeItem('token');
    setToken('');
    setUser({});
  }

  const toggleDrawer = (isOpen) => {
    setOpen(isOpen);
  }

  return (
    <Box sx={{
      flexGrow: 1
    }}>
      <AppBar>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            onClick={() => {
              toggleDrawer(true)
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography>{currentPage}</Typography>
          <Drawer 
            open={open}
            onClose={() => {
              toggleDrawer(false)
            }}
          >
            <Box onClick={() => toggleDrawer(false)} sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '250'
            }}>
              <Link to="/" onClick={() => setCurrentPage('Home')}>Home</Link> 
              { token ?
              <>
                <Link to='/account' onClick={() => setCurrentPage('Account')}>Account</Link> 
                <Link onClick={handleLogout}>Logout</Link> 
              </>
              : <Link to="/login" onClick={() => setCurrentPage('Sign In')}>Login</Link> }
              {/* Admin Pages */}
              { user?.isAdmin && <Link to="/admin" onClick={() => setCurrentPage('Admin Page')}>Admin Page</Link> }
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar;