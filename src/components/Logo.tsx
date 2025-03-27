
import React from 'react';
import { Phone } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
        <div className="relative bg-gradient-to-r from-primary/90 to-primary rounded-full p-2 text-white">
          <Phone size={iconSizes[size]} className="animate-pulse-subtle" />
        </div>
      </div>
      {variant === 'full' && (
        <span className={`font-semibold ${sizeClasses[size]}`}>
          <span className="text-primary">Screen</span>
          <span className="text-foreground">Sage</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
