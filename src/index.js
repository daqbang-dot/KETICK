import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Pastikan fail CSS ini wujud untuk Tailwind
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
