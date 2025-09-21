import React from 'react';
import './LeftSection.scss';

interface LeftSectionProps {
  children: React.ReactNode;
}

const LeftSection: React.FC<LeftSectionProps> = ({ children }) => {
  return (
    <section className="left-section">
      {children}
    </section>
  );
};

export default LeftSection;