// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root and render your app
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
