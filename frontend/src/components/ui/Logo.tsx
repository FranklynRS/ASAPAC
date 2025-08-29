import React from 'react';
import './Logo.scss';
import logoAsapac from '../../assets/logoasapac.png';

const Logo: React.FC = () => {
  return (
    <img 
      src={logoAsapac} 
      alt="ASAPAC - Associação de Amparo a Pacientes com Câncer" 
      className="logo"
    />
  );
};

export default Logo;