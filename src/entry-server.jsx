import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { ThemeProvider, CssBaseline } from '@mui/material'
import darkTheme from './muiTheme.js';

/**
 * @param {string} _url
 */
export function render(_url) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={_url}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StaticRouter>
    </StrictMode>,
  )
  return { html }
}
