import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MesesPage from './pages/MesesPage';
import MensageirosPage from './pages/MensageirosPage';
import AcertosPage from './pages/AcertosPage';
import { useAuth } from './contexts/AuthContext';
import './styles/global.scss';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />}
      />
            <Route
        path="/meses"
        element={isAuthenticated ? <MesesPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/mensageiros"
        element={isAuthenticated ? <MensageirosPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/acertos"
        element={isAuthenticated ? <AcertosPage /> : <Navigate to="/" replace />}
        />
    </Routes>
  );
};

export default App;