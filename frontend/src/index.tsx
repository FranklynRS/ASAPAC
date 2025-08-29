import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  </React.StrictMode>
);
