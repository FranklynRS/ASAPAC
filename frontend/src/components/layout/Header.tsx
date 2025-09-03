import React from 'react';
import './Header.scss';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  const userName = user?.nome_usuario || user?.email_usuario || 'User';

  return (
    <header className="header">
      <div className="header__title">ASAPAC</div>
      <div className="header__user">Olá, {userName}</div>
    </header>
  );
};

export default Header;