import React from 'react';
import Title from './Title';
import Button from './Button';
import Logo from './Logo';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

interface HeaderProps {
  showLogo?: boolean;
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showLogo = true,
  showLogout = true
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      {showLogo && (
        <section className="header__logo">
          <Logo />
        </section>
      )}
      
      <section className="header__content">
        <Title variant="primary">
          Bem-vindo, {user?.nome_usuario || 'Usuário'}!
        </Title>
      </section>
      
      {showLogout && (
        <section className="header__actions">
          <Button variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </section>
      )}
    </header>
  );
};

export default Header;