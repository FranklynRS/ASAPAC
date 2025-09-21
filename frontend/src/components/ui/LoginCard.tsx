import React from 'react';
import './LoginCard.scss';

interface LoginCardProps {
  children: React.ReactNode;
}

const LoginCard: React.FC<LoginCardProps> = ({ children }) => {
  return (
    <section className="login-card">
      {children}
    </section>
  );
};

export default LoginCard;