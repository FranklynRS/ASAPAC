import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Section from './components/layout/Section';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Section padding="large">
        <main style={{ textAlign: 'center', padding: '50px' }}>
          Carregando...
        </main>
      </Section>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
};

export default App;