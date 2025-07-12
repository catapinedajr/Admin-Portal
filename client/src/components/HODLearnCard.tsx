import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "@/lib/icons";

interface HODLearnCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "interactive" | "premium";
  className?: string;
  disabled?: boolean;
  showChevron?: boolean;
}

/**
 * HODLearn Card Format - Standardized interactive card design
 * 
 * Features:
 * - Dark/inactive state by default (zinc-900/800 background)
 * - Interactive hover states with orange glow and color transformation
 * - Subtle scale animation on hover for tactile feedback
 * - Orange border glow on engagement
 * - Consistent spacing and typography
 * - Premium variant with enhanced effects
 */
export default function HODLearnCard({ 
  children, 
  onClick, 
  variant = "default",
  className = "",
  disabled = false,
  showChevron = false
}: HODLearnCardProps) {
  
  const baseClasses = "w-full transition-all duration-300 group";
  
  const variantClasses = {
    default: `
      bg-zinc-900/50 border-zinc-700/50 
      hover:bg-zinc-800/70 hover:border-zinc-600/50
      hover:shadow-md hover:shadow-zinc-500/10
    `,
    interactive: `
      bg-zinc-900/50 border-zinc-700/50 
      hover:bg-zinc-800/50 hover:border-orange-500/30
      hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02]
      cursor-pointer
    `,
    premium: `
      bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border-zinc-700/50
      hover:from-zinc-800/80 hover:to-zinc-700/60 hover:border-orange-500/40
      hover:shadow-xl hover:shadow-orange-500/20 hover:scale-[1.03]
      hover:ring-1 hover:ring-orange-500/30
      cursor-pointer
    `
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none" : "";

  return (
    <Card 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${disabledClasses}
        ${className}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {children}
          </div>
          {showChevron && (
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors ml-3 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Optional: Specialized variants as separate components
export function HODLearnInteractiveCard({ children, onClick, className = "", showChevron = true, ...props }: Omit<HODLearnCardProps, 'variant'>) {
  return (
    <HODLearnCard 
      variant="interactive" 
      onClick={onClick} 
      showChevron={showChevron}
      className={className}
      {...props}
    >
      {children}
    </HODLearnCard>
  );
}

export function HODLearnPremiumCard({ children, onClick, className = "", showChevron = true, ...props }: Omit<HODLearnCardProps, 'variant'>) {
  return (
    <HODLearnCard 
      variant="premium" 
      onClick={onClick} 
      showChevron={showChevron}
      className={className}
      {...props}
    >
      {children}
    </HODLearnCard>
  );
}