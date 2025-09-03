import React from 'react';
import './Header.scss';
import { useAuth } from '../../contexts/AuthContext';
import usuarioIcon from '../../assets/usuario.png'

const Header: React.FC = () => {
  const { user } = useAuth();

  const userName = user?.nome_usuario || user?.email_usuario || 'User';

  return (
    <header className="header">
      <div className="header__title">ASAPAC</div>
      <div className="header__user">
        <img src={usuarioIcon} alt="Ícone do usuário" className='header__user-icon' />
        {userName}
        </div>
    </header>
  );
};

export default Header;