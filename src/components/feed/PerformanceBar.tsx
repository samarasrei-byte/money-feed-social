import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceBarProps {
  data: number[]; // Array of 7 values (last 7 days)
  label?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function PerformanceBar({ data, label = "7 dias", trend, className }: PerformanceBarProps) {
  const maxValue = Math.max(...data, 1);
  const normalizedData = data.map((v) => (v / maxValue) * 100);
  
  const calculatedTrend = trend ?? (() => {
    const firstHalf = data.slice(0, 3).reduce((a, b) => a + b, 0);
    const secondHalf = data.slice(4).reduce((a, b) => a + b, 0);
    if (secondHalf > firstHalf * 1.1) return "up";
    if (secondHalf < firstHalf * 0.9) return "down";
    return "neutral";
  })();

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const barColors = {
    up: "bg-success",
    down: "bg-destructive",
    neutral: "bg-primary",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-end gap-0.5 h-5">
        {normalizedData.map((height, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 rounded-full transition-all duration-300",
              barColors[calculatedTrend],
              index === normalizedData.length - 1 ? "opacity-100" : "opacity-60"
            )}
            style={{ height: `${Math.max(height, 15)}%` }}
          />
        ))}
      </div>
      <div className={cn("flex items-center gap-1 text-xs font-medium", trendColors[calculatedTrend])}>
        {calculatedTrend === "up" && <TrendingUp className="h-3 w-3" />}
        {calculatedTrend === "down" && <TrendingDown className="h-3 w-3" />}
        <span>{label}</span>
      </div>
    </div>
  );
}
