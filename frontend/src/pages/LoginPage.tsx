import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import logoAsapac from '../assets/logoasapac.png';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        {/* Lado esquerdo - Logo */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <img 
              src={logoAsapac} 
              alt="ASAPAC Logo" 
              className="logo"
            />
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="form-section">
          <div className="form-wrapper">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;