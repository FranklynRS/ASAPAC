import React from 'react';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'success' | 'info';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = ''
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <button 
      type={type} 
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`button button--${variant} button--${size} ${loading ? 'button--loading' : ''} ${isDisabled ? 'button--disabled' : ''} ${className}`}
    >
      {loading ? (
        <span className="button__spinner">⏳</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;