import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';

// ✅ Importar nuestro archivo de fuentes personalizado en lugar de los originales
import './assets/fonts.css';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
);