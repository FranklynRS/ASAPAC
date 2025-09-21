import React from 'react';
import './Container.scss';
import LoginCard from '../ui/LoginCard';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <main className="container">
      <LoginCard>
        {children}
      </LoginCard>
    </main>
  );
};

export default Container;