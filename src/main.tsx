import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { AppToaster } from '@/components/ui/app-toaster'

import { initTheme } from '@/lib/theme'

import App from './App.tsx'
import './index.css'

initTheme()

const rootElement = document.getElementById('root') as HTMLElement

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <AppToaster />
    </BrowserRouter>
  </StrictMode>,
)
