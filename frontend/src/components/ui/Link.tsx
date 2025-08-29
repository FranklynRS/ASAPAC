import React from 'react';
import './Link.scss';

interface LinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

const Link: React.FC<LinkProps> = ({ children, onClick, href = '#' }) => {
  return (
    <a 
      href={href}
      onClick={onClick}
      className="link"
    >
      {children}
    </a>
  );
};

export default Link;