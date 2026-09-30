import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import './assets/fonts.css';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const initializeTheme = () => {
  const currentMode = localStorage.getItem('mui-mode');
  
  if (!currentMode || currentMode === 'system') {
    localStorage.setItem('mui-mode', 'light');
    document.documentElement.setAttribute('data-mui-color-scheme', 'light');
  } else if (currentMode === 'dark') {
    document.documentElement.setAttribute('data-mui-color-scheme', 'dark');
  } else {
    localStorage.setItem('mui-mode', 'light');
    document.documentElement.setAttribute('data-mui-color-scheme', 'light');
  }

  localStorage.removeItem('mui-color-scheme');
  document.documentElement.style.colorScheme = localStorage.getItem('mui-mode') || 'light';
};

initializeTheme();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);