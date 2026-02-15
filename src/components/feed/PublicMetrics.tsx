import { TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicMetricsProps {
  earnings?: number;
  views?: number;
  clicks?: number;
  className?: string;
}

function formatNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

export function PublicMetrics({ earnings, views, clicks, className }: PublicMetricsProps) {
  const hasMetrics = earnings || views || clicks;
  if (!hasMetrics) return null;

  return (
    <div className={cn("flex items-center gap-3 px-4 py-1.5", className)}>
      {earnings !== undefined && earnings > 0 && (
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
          <TrendingUp className="h-3 w-3" />
          <span>R$ {formatNumber(earnings)}</span>
        </div>
      )}
      {views !== undefined && views > 0 && (
        <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
          <Eye className="h-3 w-3" />
          <span>{formatNumber(views)}</span>
        </div>
      )}
      {clicks !== undefined && clicks > 0 && (
        <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
          <MousePointerClick className="h-3 w-3" />
          <span>{formatNumber(clicks)}</span>
        </div>
      )}
    </div>
  );
}
