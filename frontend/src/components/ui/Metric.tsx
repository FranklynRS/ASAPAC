import React from 'react';
import Title from './Title';
import './Metric.scss';

interface MetricProps {
  value: string | number;
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const Metric: React.FC<MetricProps> = ({ 
  value, 
  label, 
  variant = 'primary',
  size = 'medium',
  suffix = '',
  prefix = '',
  trend = 'neutral'
}) => {
  return (
    <article className={`metric metric--${variant} metric--${size}`}>
      <Title variant="secondary">{label}</Title>
      <strong className={`metric__value metric__value--${trend}`}>
        {prefix}{value}{suffix}
      </strong>
      {trend !== 'neutral' && (
        <span className={`metric__trend metric__trend--${trend}`}>
          {trend === 'up' ? '↗' : '↘'}
        </span>
      )}
    </article>
  );
};

export default Metric;