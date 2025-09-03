import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoAsapac from '../../assets/logoasapac.png';
import mensageiroIcon from '../../assets/mensageiros_icon.png';
import acertosIcon from '../../assets/acertos_icon.png';
import mesesIcon from '../../assets/meses_icon.png';
import mensageiroIconAlt from '../../assets/mensageiros_icon_alt.png';
import acertosIconAlt from '../../assets/acertos_icon_alt.png';
import mesesIconAlt from '../../assets/meses_icon_alt.png';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.scss';

interface SidebarProps {
  onMenuClick: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState('Meses');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleMenuClick = (item: string) => {
    setActiveItem(item);
    onMenuClick(item);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logoAsapac} alt="ASAPAC" className="sidebar__logo-img" />
      </div>
      <nav className="sidebar__nav">
        <button 
          className={`sidebar__item ${activeItem === 'Meses' ? 'sidebar__item--active' : ''}`}
          onClick={() => handleMenuClick('Meses')}
        >
          <img 
            src={activeItem === 'Meses' ? mesesIconAlt : mesesIcon}
            alt="Meses"
            className="sidebar__icon-img"
          />
          <span className="sidebar__text">Meses</span>
        </button>
        
        <button className="sidebar__item" onClick={() => onMenuClick('Mensageiros')}>
          <img src={mensageiroIcon} alt="Mensageiros" className="sidebar__icon-img" />
          <span className="sidebar__text">Mensageiros</span>
        </button>
        
        <button className="sidebar__item" onClick={() => onMenuClick('Acertos')}>
          <img src={acertosIcon} alt="Acertos" className="sidebar__icon-img" />
          <span className="sidebar__text">Acertos</span>
        </button>
      </nav>
        
        <button className="sidebar__item sidebar__item--logout" onClick={handleLogout}>
          <span className="sidebar__text">Sair</span>
        </button>
    </aside>
  );
};

export default Sidebar;