import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { AuthContext } from "../../App";
import { Box, Link, AppBar, Toolbar, IconButton, Drawer, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ConstructionIcon from '@mui/icons-material/Construction';
import NavDrawer from './NavDrawer/NavDrawer';
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

  const linkMenuStyle = {
    fontSize: '1.2rem',
    color: 'white',
    textDecoration: 'none',
    py: '.5rem'
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
      <AppBar sx={{
        backgroundColor: "rgb(42 42 42)",
      }}>
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
              variant='temporary'
              open={open}
              onClose={() => {
                toggleDrawer(false)
              }}
              sx={{
                display: { mobile: 'flex', desktop: 'none'},
              }}
            >
              <NavDrawer toggleDrawer={toggleDrawer}/>
            </Drawer>
            <Drawer 
              variant='permanent'
              open={open}
              onClose={() => {
                toggleDrawer(false)
              }}
              sx={{
                display: { mobile: 'none', desktop: 'flex'},
              }}
            >
              <NavDrawer toggleDrawer={toggleDrawer}/>
            </Drawer>
          </Box>
          <Box sx={{
            flexGrow: 1,
            ml: '.5rem'
          }}>
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
                <Link onClick={handleLogout} sx={linkMenuStyle} to="/">Logout</Link> 
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