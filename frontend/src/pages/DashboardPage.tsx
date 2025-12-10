import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar'; 
import MesesPage from './MesesPage';
import MensageirosPage from './MensageirosPage';
import AcertosPage from './AcertosPage';
import CategoriasPage from './CategoriasPage';

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
          return <h2>Por favor, selecione um mês.</h2>;
        }
        return <AcertosPage idMes={selectedMes.id} mesNome={selectedMes.nome} onVoltarClick={() => handleMenuClick('Meses')} />;
      case 'Categorias':
        return <CategoriasPage />;
      default:
        return <h2>Conteúdo não encontrado</h2>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      <Sidebar onMenuClick={handleMenuClick} activePage={activePage} />
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100vh', overflow: 'hidden' }}>
        
        <TopBar />

        <main style={{ 
            flex: 1, 
            background: '#f8f9fa', 
            overflowY: 'auto', 
            overflowX: 'hidden',
            position: 'relative'
        }}>
          {renderContent()}
        </main>

      </div>
    </div>
  );
};

export default DashboardPage;