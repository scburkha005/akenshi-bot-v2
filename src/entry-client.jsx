import './index.css'
import React, { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Link as RouterLink } from 'react-router';

const darkTheme = createTheme({
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
  }
});

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)