import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'sm' }) => {
  const isLarge = size === 'lg';
  const sizeClasses = isLarge ? "w-24 h-24" : "w-8 h-8";
  
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className={`${sizeClasses} text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Shield - Defense */}
        <path 
            d="M50 5 L15 20 V45 C15 65 35 85 50 95 C65 85 85 65 85 45 V20 L50 5 Z" 
            className="stroke-blue-500/80 stroke-[3] fill-navy-900/80"
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        
        {/* Inner Medical Cross - Health */}
        <path 
            d="M50 28 V72 M28 50 H72" 
            className="stroke-emerald-500 stroke-[6]" 
            strokeLinecap="round"
        />
        
        {/* Neural Nodes - AI Intelligence */}
        <circle cx="50" cy="28" r="4" className="fill-blue-200 animate-pulse" />
        <circle cx="50" cy="72" r="4" className="fill-blue-200 animate-pulse" />
        <circle cx="28" cy="50" r="4" className="fill-blue-200 animate-pulse" />
        <circle cx="72" cy="50" r="4" className="fill-blue-200 animate-pulse" />
        
        {/* Central Core */}
        <circle cx="50" cy="50" r="8" className="fill-white/90 shadow-[0_0_10px_white]" />
      </svg>
    </div>
  );
};

export default Logo;