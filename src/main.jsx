import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👉 ĐÃ BỌC GoogleOAuthProvider XUNG QUANH APP VÀ GẮN CLIENT ID */}
    <GoogleOAuthProvider clientId="378141721747-u4fvabr2r7ub834lic08l41uoeo2skk8.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)