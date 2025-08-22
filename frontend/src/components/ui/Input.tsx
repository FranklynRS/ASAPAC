import React from 'react';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  error?: boolean;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ 
  icon, 
  iconPosition = 'start', 
  error = false,
  helperText,
  className,
  ...props 
}) => {
  return (
    <div className={`input-wrapper ${className || ''}`}>
      <div className={`input-container ${error ? 'error' : ''}`}>
        {icon && iconPosition === 'start' && (
          <div className="input-icon start">
            {icon}
          </div>
        )}
        
        <input
          className="input-field"
          {...props}
        />
        
        {icon && iconPosition === 'end' && (
          <div className="input-icon end">
            {icon}
          </div>
        )}
      </div>
      
      {helperText && (
        <div className={`helper-text ${error ? 'error' : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;