import React from 'react';
import './Title.scss';

interface TitleProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Title: React.FC<TitleProps> = ({ children, variant = 'primary' }) => {
  return (
    <h1 className={`title title--${variant}`}>
      {children}
    </h1>
  );
};

export default Title;