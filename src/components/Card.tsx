
import { cn } from '@/lib/utils';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'outline';
  onClick?: () => void;
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  onClick,
  animate = false
}) => {
  const baseClasses = "rounded-xl overflow-hidden";
  
  const variantClasses = {
    default: "bg-white border shadow-sm",
    glass: "glass-card",
    outline: "border bg-background/50",
  };
  
  const animationClasses = animate ? "transition-all duration-300 hover:shadow-md hover:-translate-y-1" : "";
  const cursorClasses = onClick ? "cursor-pointer" : "";
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses,
        cursorClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
