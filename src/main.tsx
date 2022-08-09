import { StrictMode } from 'react'

import App from './App'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

export const endpoint =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://problemmanager.learningman.top'
