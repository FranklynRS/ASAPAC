import React from 'react';
import './RightSection.scss';

interface RightSectionProps {
  children: React.ReactNode;
}

const RightSection: React.FC<RightSectionProps> = ({ children }) => {
  return (
    <section className="right-section">
      {children}
    </section>
  );
};

export default RightSection;