import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'start',
  fullWidth = false,
  children,
  disabled,
  className,
  ...props 
}) => {
  const isDisabled = disabled || loading;

  const buttonClass = [
    'button',
    `button-${variant}`,
    fullWidth ? 'button-full-width' : '',
    isDisabled ? 'button-disabled' : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="button-spinner" />
      )}
      
      {!loading && icon && iconPosition === 'start' && (
        <span className="button-icon start">
          {icon}
        </span>
      )}
      
      <span className="button-text">
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'end' && (
        <span className="button-icon end">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;