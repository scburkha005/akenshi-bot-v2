import { useContext, useState } from 'react';
import { AuthContext } from "../App";
import { Box, Link, AppBar, Toolbar, IconButton, Drawer, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
function Navbar () {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home')
  const linkSx = {
    fontSize: '2rem',
    color: 'white',
    textDecoration: 'none',
    py: 1
  }
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
            sx={{
              ":focus": {
                outline: 'none'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h5'>{currentPage}</Typography>
          <Drawer 
            open={open}
            onClose={() => {
              toggleDrawer(false)
            }}
          >
            <Box onClick={() => toggleDrawer(false)} sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'left',
              px: '8rem'
            }}>
              <Link to="/" onClick={() => setCurrentPage('Home')} sx={linkSx}>Home</Link> 
              { token ?
              <>
                <Link to='/account' onClick={() => setCurrentPage('Account')} sx={linkSx}>Account</Link> 
                <Link onClick={handleLogout} sx={linkSx}>Logout</Link> 
              </>
              : <Link to="/login" onClick={() => setCurrentPage('Sign In')} sx={linkSx}>Login</Link> }
              {/* Admin Pages */}
              { user?.isAdmin && <Link to="/admin" onClick={() => setCurrentPage('Admin Page')} sx={linkSx}>Admin Page</Link> }
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar;