import React from 'react';

interface HealthTickLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-auto',
  md: 'h-12 w-auto',
  lg: 'h-16 w-auto',
  xl: 'h-20 w-auto'
};

export const HealthTickLogo: React.FC<HealthTickLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/healthtick.png"
        alt="HealthTick"
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to SVG if PNG fails
          const target = e.target as HTMLImageElement;
          target.src = '/healthtick.svg';
        }}
      />
    </div>
  );
};