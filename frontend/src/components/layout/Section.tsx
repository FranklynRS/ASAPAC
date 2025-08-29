import React from 'react';
import './Section.scss';

interface SectionProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  background?: 'transparent' | 'light' | 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  padding = 'medium',
  background = 'transparent',
  fullWidth = false
}) => {
  return (
    <section 
      className={`section section--padding-${padding} section--bg-${background} ${fullWidth ? 'section--full-width' : ''}`}
    >
      {children}
    </section>
  );
};

export default Section;