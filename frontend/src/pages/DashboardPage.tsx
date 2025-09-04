import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MesesPage from './MesesPage'; 
import MensageirosPage from './MensageirosPage'; 
import AcertosPage from './AcertosPage'; 
const DashboardPage: React.FC = () => {
  const [activePage, setActivePage] = useState('Meses'); 

  const renderContent = () => {
    switch (activePage) {
      case 'Meses':
        return <MesesPage />;
      case 'Mensageiros':
        return <MensageirosPage />;
      case 'Acertos':
        return <AcertosPage />;
      default:
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