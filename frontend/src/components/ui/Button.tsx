import React from 'react';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <button 
      type={type} 
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`button button--${variant} ${loading ? 'button--loading' : ''} ${isDisabled ? 'button--disabled' : ''}`}
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