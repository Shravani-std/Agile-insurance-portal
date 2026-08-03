import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { getStoredTheme, setHtmlTheme } from "./utils/theme.js"
import { SettingsProvider } from "./hooks/SettingsContext.jsx"
// App bootstrap. Wrap new global providers here when adding app-wide settings or branding state.
setHtmlTheme(getStoredTheme());

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SettingsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SettingsProvider>
  </BrowserRouter>
);