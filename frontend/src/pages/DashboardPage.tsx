import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MesesPage from './MesesPage'; // Importe a página de Meses
import MensageirosPage from './MensageirosPage'; // Importe a página de Mensageiros
import AcertosPage from './AcertosPage'; // Importe a página de Acertos

const DashboardPage: React.FC = () => {
  const [activePage, setActivePage] = useState('Meses'); // 'Meses' como padrão

  const renderContent = () => {
    switch (activePage) {
      case 'Meses':
        return <MesesPage />;
      case 'Mensageiros':
        return <MensageirosPage />;
      case 'Acertos':
        return <AcertosPage />;
      default:
        return <h2>Dashboard - Conteúdo principal aqui</h2>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar onMenuClick={setActivePage} />
        <main style={{ flex: 1, padding: '24px', background: '#f8f9fa' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;