import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-primary",
      "relative overflow-hidden",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}