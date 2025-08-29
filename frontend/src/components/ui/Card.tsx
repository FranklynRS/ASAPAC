import React from 'react';
import './Card.scss';

interface CardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  elevated?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  elevated = false,
  onClick
}) => {
  return (
    <section 
      className={`card card--${variant} card--${size} ${elevated ? 'card--elevated' : ''} ${onClick ? 'card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </section>
  );
};

export default Card;