import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { AuthContext } from "../App";
import { Box, Link, AppBar, Toolbar, IconButton, Drawer, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
function Navbar () {
  const { user, token, setToken, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home')
  const [anchorUser, setAnchorUser] = useState(null);
  let location = useLocation();

  useEffect(() => {
    // Calculate page name based on url route
    let pageName = location.pathname.slice(1) || "Home";
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    setCurrentPage(pageName);
  }, [location])

  const linkDrawerStyle = {
    fontSize: '2rem',
    color: 'white',
    textDecoration: 'none',
    py: 1
  }
  const linkMenuStyle = {
    fontSize: '1.2rem',
    color: 'white',
    textDecoration: 'none',
    py: 1
  }
  function handleLogout () {
    localStorage.removeItem('token');
    setToken('');
    setUser({});
  }

  function toggleDrawer (isOpen) {
    setOpen(isOpen);
  }

  function handleOpenUserMenu (e) {
    setAnchorUser(e.currentTarget);
  }

  function handleCloseUserMenu () {
    setAnchorUser(null);
  }

  return (
    <Box>
      <AppBar sx={{ backgroundColor: "rgb(42 42 42 / 46%)"}}>
        <Toolbar>
          <Box>
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
                <Link to="/" sx={linkDrawerStyle}>Home</Link> 
                { token && <Link to='/account' sx={linkDrawerStyle}>Account</Link> }
                {/* Admin Pages */}
                { user?.isAdmin && <Link to="/admin" sx={linkDrawerStyle}>Admin Page</Link> }
              </Box>
            </Drawer>
          </Box>
          <Box sx={{flexGrow: 1}}>
            <Typography variant='h5'>{currentPage}</Typography>
          </Box>
          <Box>
          { token ? 
          <>
            <IconButton onClick={handleOpenUserMenu} 
              sx={{
                ":focus": {
                  outline: 'none'
                }
              }}
            >
              <Avatar src={user.twitchProfileImageUrl}/>
            </IconButton>
            <Menu open={Boolean(anchorUser)} onClose={handleCloseUserMenu} anchorEl={anchorUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              sx={{
                mt: '2.5rem'
              }}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Link to='/account' sx={linkMenuStyle}>Account</Link> 
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Link onClick={handleLogout} sx={linkMenuStyle}>Logout</Link> 
              </MenuItem>
            </Menu>
          </>
            :
          <Link to="/login" sx={{
            color: 'white',
            fontSize: '1.2rem'
          }}>Login</Link>
          }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar;