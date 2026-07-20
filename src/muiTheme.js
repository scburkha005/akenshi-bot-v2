import { Link as RouterLink } from 'react-router';
import { createTheme } from '@mui/material'

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: 'rgb(42 42 42)',
      paper: 'rgb(42 42 42)'
    },
  },
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          color: '#90caf9',
        }
      }
    },
    // Allows use of mui links that inherit the behavior of react router links
    MuiLink: {
      defaultProps: {
        component: RouterLink
      }
    }
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      desktop: 1024,
      "desktop-l": 1441
    }
  }
});