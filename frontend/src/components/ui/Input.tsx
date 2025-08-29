import React from 'react';
import './Input.scss';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  error?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  type, 
  placeholder, 
  value, 
  onChange,
  showPasswordToggle,
  onTogglePassword,
  error,
  disabled = false
}) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''}`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          className="input-toggle"
          onClick={onTogglePassword}
          disabled={disabled}
        >
          👁
        </button>
      )}
      {error && (
        <span className="input-error">{error}</span>
      )}
    </div>
  );
};

export default Input;