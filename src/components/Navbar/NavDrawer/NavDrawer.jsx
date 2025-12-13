import { Box, Typography, Link, Paper } from '@mui/material'
import { AuthContext } from '../../../App';
import { useContext } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ConstructionIcon from '@mui/icons-material/Construction';

function NavDrawer ({ toggleDrawer }) {
  const { token, user } = useContext(AuthContext);
  const linkDrawerStyle = {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textDecoration: 'none',
    py: '.5rem',
    pl: '1rem'
  }
  const drawerTextStyle = {
    fontSize: '1.8rem',
    pl: '1rem' 
  }
  return (
    <Box onClick={() => toggleDrawer(false)} sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'left',
      width: '16rem',
    }}>
      <Paper 
        elevation="4"
        square="true"
        sx={{
          height: '56px',
          "--Paper-shadow": "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important",
          "--Paper-overlay": "linear-gradient(rgba(255, 255, 255, 0.092), rgba(255, 255, 255, 0.092)) !important",
        }}
      ></Paper>
      <Link to="/" sx={linkDrawerStyle}>
        <HomeIcon />
        <Typography sx={drawerTextStyle}>Home</Typography>
      </Link> 
      { token && 
      <>
      <Link to='/account' sx={linkDrawerStyle}>
        <AccountBoxIcon />
        <Typography sx={drawerTextStyle}>Account</Typography>
      </Link> 
      <Link to='/testing' sx={linkDrawerStyle}>
        <ConstructionIcon />
        <Typography sx={drawerTextStyle}>Testing Area</Typography>
      </Link>
      </>
      }
      {/* Admin Pages */}
      { user?.isAdmin && 
      <Link to="/admin" sx={linkDrawerStyle}>
        <AdminPanelSettingsIcon />
        <Typography sx={drawerTextStyle}>Admin Page</Typography>
      </Link> 
      }
    </Box>
  );
}

export default NavDrawer;