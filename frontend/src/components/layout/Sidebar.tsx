import React from 'react';
import logoAsapac from '../../assets/logoasapac.png';
import mesesIcon from '../../assets/meses_icon.png';
import mensageiroIcon from '../../assets/mensageiros_icon.png';
import categoriaIcon from '../../assets/categoria.png';
import mesesIconAlt from '../../assets/meses_icon_alt.png';
import mensageiroIconAlt from '../../assets/mensageiros_icon_alt.png';
import categoriaIconAlt from '../../assets/categoria_alt.png';

import './Sidebar.scss';

interface SidebarProps {
  onMenuClick: (page: string) => void;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick, activePage }) => {
  
  const handleMenuClick = (item: string) => {
    onMenuClick(item);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logoAsapac} alt="ASAPAC" className="sidebar__logo-img" />
      </div>
      <nav className="sidebar__nav">
        <button
          className={`sidebar__item ${activePage === 'Meses' ? 'sidebar__item--active' : ''}`}
          onClick={() => handleMenuClick('Meses')}
        >
          <img
            src={activePage === 'Meses' ? mesesIconAlt : mesesIcon}
            alt="Meses"
            className="sidebar__icon-img"
          />
          <span className="sidebar__text">Meses</span>
        </button>

        <button
          className={`sidebar__item ${activePage === 'Mensageiros' ? 'sidebar__item--active' : ''}`}
          onClick={() => handleMenuClick('Mensageiros')}
        >
          <img
            src={activePage === 'Mensageiros' ? mensageiroIconAlt : mensageiroIcon}
            alt="Mensageiros"
            className="sidebar__icon-img"
          />
          <span className="sidebar__text">Mensageiros</span>
        </button>

        <button
          className={`sidebar__item ${activePage === 'Categorias' ? 'sidebar__item--active' : ''}`}
          onClick={() => handleMenuClick('Categorias')}
        >
          <img
            src={activePage === 'Categorias' ? categoriaIconAlt : categoriaIcon}
            alt="Categorias"
            className="sidebar__icon-img"
          />
          <span className="sidebar__text">Categorias</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;