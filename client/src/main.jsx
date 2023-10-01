import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DarkModeContextProvider } from './context/Darkmodecontext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
     <AuthContextProvider>
    <DarkModeContextProvider>

    <App />
    </DarkModeContextProvider>
     </AuthContextProvider>
  </React.StrictMode>
)
