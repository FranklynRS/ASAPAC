import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTemp from './App-temp';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppTemp />
  </React.StrictMode>
);