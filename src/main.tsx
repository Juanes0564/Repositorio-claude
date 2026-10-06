import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './styles/index.css'
import './styles/simulator.css'
import './styles/copilot.css'
import './styles/workshops.css'
import './styles/screens.css'
import { App } from './App'
import { AppStateProvider } from './state/AppState'
import { setupInstallPrompt } from './lib/install'

setupInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppStateProvider>
  </StrictMode>,
)
