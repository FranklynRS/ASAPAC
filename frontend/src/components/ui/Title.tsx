import React from 'react';
import './Title.scss';

interface TitleProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Title: React.FC<TitleProps> = ({ children, variant = 'primary', className = '' }) => {
  return (
    <h1 className={`title title--${variant} ${className}`}>
      {children}
    </h1>
  );
};

export default Title;