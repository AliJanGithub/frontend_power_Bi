import React from 'react';
import { useSettings } from './SettingsContext';
import { BarChart3 } from './icons/Icons';



export function Logo({ size = 'md', showText = true, className = '' }) {
  const { settings } = useSettings();
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-7 w-7',
    xl: 'h-9 w-9'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        {settings.companyLogo ? (
          <img
            src={settings.companyLogo}
            alt={`${settings.companyName} Logo`}
            className={`${sizeClasses[size]} object-contain rounded-lg`}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center shadow-sm`}>
            <BarChart3 className={`${iconSizeClasses[size]} text-white`} />
          </div>
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary ${textSizeClasses[size]} leading-tight`}>
            {settings.companyName}
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground -mt-1">
              BI for everyone, everywhere
            </span>
          )}
        </div>
      )}
    </div>
  );
}