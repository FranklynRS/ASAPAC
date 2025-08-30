import React from 'react';
import './Header.scss';

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = 'Luiz Gustavo' }) => {
  return (
    <header className="header">
      <div className="header__title">ASAPAC</div>
      <div className="header__user">Olá, {userName}</div>
    </header>
  );
};

export default Header;