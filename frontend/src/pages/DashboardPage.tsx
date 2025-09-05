import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MesesPage from './MesesPage';
import MensageirosPage from './MensageirosPage';
import AcertosPage from './AcertosPage';

const DashboardPage: React.FC = () => {
  const [activePage, setActivePage] = useState('Meses');
  const [selectedMes, setSelectedMes] = useState<{ id: number; nome: string } | null>(null);

  const handleMenuClick = (page: string) => {
    setActivePage(page);
    setSelectedMes(null);
  };

  const handleLancamentosClick = (mes: { id: number; nome: string }) => {
    setActivePage('Acertos');
    setSelectedMes(mes);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Meses':
        return <MesesPage onLancamentosClick={handleLancamentosClick} />;
      case 'Mensageiros':
        return <MensageirosPage />;
      case 'Acertos':
        if (selectedMes === null) {
          return <h2>Por favor, selecione um mês para ver os lançamentos.</h2>;
        }
        return <AcertosPage idMes={selectedMes.id} mesNome={selectedMes.nome} onVoltarClick={() => handleMenuClick('Meses')} />;
      default:
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar onMenuClick={handleMenuClick} activePage={activePage} />
        <main style={{ flex: 1, padding: '24px', background: '#f8f9fa' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;