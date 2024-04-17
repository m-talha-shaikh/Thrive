import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DarkModeContextProvider } from './context/Darkmodecontext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ProfileTypeContextProvider } from './context/ProfileTypeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <AuthContextProvider>
    <DarkModeContextProvider>
    <ProfileTypeContextProvider>
      <App />
    </ProfileTypeContextProvider>
    </DarkModeContextProvider>
    </AuthContextProvider>
    
  </React.StrictMode>
)
