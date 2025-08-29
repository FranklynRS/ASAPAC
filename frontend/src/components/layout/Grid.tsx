import React from 'react';
import './Grid.scss';

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'small' | 'medium' | 'large';
  responsive?: boolean;
}

const Grid: React.FC<GridProps> = ({ 
  children, 
  columns = 3,
  gap = 'medium',
  responsive = true
}) => {
  return (
    <section 
      className={`grid grid--${columns}col grid--gap-${gap} ${responsive ? 'grid--responsive' : ''}`}
    >
      {children}
    </section>
  );
};

export default Grid;