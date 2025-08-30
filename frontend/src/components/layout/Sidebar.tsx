import React from 'react';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <button className="sidebar__item">
          <span className="sidebar__icon">📊</span>
          <span className="sidebar__text">Lançar</span>
        </button>
        
        <button className="sidebar__item">
          <span className="sidebar__icon">🚴‍♂️</span>
          <span className="sidebar__text">Mensageiros</span>
        </button>
        
        <button className="sidebar__item">
          <span className="sidebar__icon">📋</span>
          <span className="sidebar__text">Acertos</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;