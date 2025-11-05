import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
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
      default: 'rgb(42 42 42 / 46%)',
      paper: 'rgb(42 42 42 / 46%)'
    },
  },
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