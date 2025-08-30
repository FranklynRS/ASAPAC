import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          {/* Conteúdo principal do dashboard virá aqui */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;