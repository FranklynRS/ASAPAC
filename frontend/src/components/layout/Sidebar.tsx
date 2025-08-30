import React from 'react';
import logoAsapac from '../../assets/logoasapac.png';
import motocicletaIcon from '../../assets/motocicleta_icon.png';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logoAsapac} alt="ASAPAC" className="sidebar__logo-img" />
      </div>
      <nav className="sidebar__nav">
        <button className="sidebar__item">
          <span className="sidebar__icon">📊</span>
          <span className="sidebar__text">Lançar</span>
        </button>
        
        <button className="sidebar__item">
          <img src={motocicletaIcon} alt="Mensageiros" className="sidebar__icon-img" />
          <span className="sidebar__text">Mensageiros</span>
        </button>
        
        <button className="sidebar__item">
          <span className="sidebar__icon">❤️</span>
          <span className="sidebar__text">Acertos</span>
        </button>
        
        <button className="sidebar__item sidebar__item--logout" onClick={handleLogout}>
          <span className="sidebar__icon">🚪</span>
          <span className="sidebar__text">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;