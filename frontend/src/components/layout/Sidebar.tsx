import React from 'react';
import logoAsapac from '../../assets/logoasapac.png';
import mensageiroIcon from '../../assets/mensageiros_icon.png';
import acertosIcon from '../../assets/acertos_icon.png';
import mesesIcon from '../../assets/meses_icon.png';
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
          <img src={mesesIcon} alt="Mensageiros" className="sidebar__icon-img" />
          <span className="sidebar__text">Meses</span>
        </button>
        
        <button className="sidebar__item">
          <img src={mensageiroIcon} alt="Mensageiros" className="sidebar__icon-img" />
          <span className="sidebar__text">Mensageiros</span>
        </button>
        
        <button className="sidebar__item">
          <img src={acertosIcon} alt="Mensageiros" className="sidebar__icon-img" />
          <span className="sidebar__text">Acertos</span>
        </button>
      </nav>
        
        <button className="sidebar__item sidebar__item--logout" onClick={handleLogout}>
          <span className="sidebar__text">Logout</span>
        </button>
    </aside>
  );
};

export default Sidebar;