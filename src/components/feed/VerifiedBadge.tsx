import { BadgeCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  earnings?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerifiedBadge({ earnings, size = "md", className }: VerifiedBadgeProps) {
  const formatEarnings = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return `R$ ${value.toFixed(0)}`;
  };

  const sizeClasses = {
    sm: "h-5 px-2 text-xs gap-1",
    md: "h-6 px-2.5 text-xs gap-1.5",
    lg: "h-7 px-3 text-sm gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        "bg-gradient-success text-success-foreground",
        "shadow-sm",
        sizeClasses[size],
        className
      )}
    >
      <BadgeCheck className={iconSizes[size]} />
      {earnings !== undefined ? (
        <>
          <span>{formatEarnings(earnings)}</span>
          <TrendingUp className={cn(iconSizes[size], "opacity-80")} />
        </>
      ) : (
        <span>Verificado</span>
      )}
    </div>
  );
}
