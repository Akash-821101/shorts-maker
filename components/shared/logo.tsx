import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const fontSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2 group cursor-pointer", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl bg-primary/5 transition-all duration-300 group-hover:bg-primary/10",
        size === 'sm' ? 'p-1.5' : 'p-2'
      )}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={cn(sizes[size])}
        >
          <defs>
            <linearGradient id="logo-gradient-new" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
            <style>{`
              @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(0.8); }
              }
              .logo-sparkle { animation: sparkle 2s infinite ease-in-out; }
              .logo-sparkle-delayed { animation: sparkle 2s infinite ease-in-out 1s; }
            `}</style>
          </defs>

          {/* Smartphone / Shorts Frame */}
          <rect x="30" y="15" width="40" height="70" rx="10" stroke="url(#logo-gradient-new)" strokeWidth="4" fill="transparent" />
          
          {/* Play Button Circle */}
          <circle cx="50" cy="50" r="12" fill="url(#logo-gradient-new)" />
          <path d="M47 44V56L56 50L47 44Z" fill="white" />

          {/* AI Sparkles */}
          <g transform="translate(64, 10)">
            <path className="logo-sparkle" d="M5 0L6.12257 3.87743L10 5L6.12257 6.12257L5 10L3.87743 6.12257L0 5L3.87743 3.87743L5 0Z" fill="#F59E0B" />
            <path className="logo-sparkle-delayed" d="M14 6L14.6735 8.32646L17 9L14.6735 9.67354L14 12L13.3265 9.67354L11 9L13.3265 8.32646L14 6Z" fill="#F59E0B" fillOpacity="0.7" />
          </g>
          
          {/* Notch */}
          <rect x="42" y="15" width="16" height="4" rx="2" fill="url(#logo-gradient-new)" />
        </svg>
      </div>
      {!iconOnly && (
        <span className={cn(
          "font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
          fontSizes[size]
        )}>
          Shorts-Maker
        </span>
      )}
    </Link>
  );
}
