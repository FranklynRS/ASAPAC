import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '24px', background: '#f8f9fa' }}>
          <h2>Dashboard - Conteúdo principal aqui</h2>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;