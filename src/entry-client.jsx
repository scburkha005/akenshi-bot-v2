import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { ThemeProvider, CssBaseline } from '@mui/material'
import darkTheme from './muiTheme.js';

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