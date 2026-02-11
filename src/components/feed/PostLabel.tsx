import { BadgeCheck, ShoppingBag, Megaphone, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type PostLabelType = "verified_result" | "active_offer" | "sponsored";

interface PostLabelProps {
  label: PostLabelType;
  metadata?: {
    amount?: number;
    period?: string;
    product_name?: string;
    commission_percent?: number;
    offer_url?: string;
    brand_name?: string;
  };
  className?: string;
}

const labelConfig: Record<PostLabelType, {
  icon: typeof BadgeCheck;
  text: string;
  className: string;
}> = {
  verified_result: {
    icon: BadgeCheck,
    text: "Resultado Verificado",
    className: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
  },
  active_offer: {
    icon: ShoppingBag,
    text: "Oferta Ativa",
    className: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
  },
  sponsored: {
    icon: Megaphone,
    text: "Patrocinado",
    className: "bg-gradient-to-r from-violet-500 to-purple-500 text-white",
  },
};

function formatCurrency(value: number) {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
  return `R$ ${value.toFixed(0)}`;
}

export function PostLabel({ label, metadata, className }: PostLabelProps) {
  const config = labelConfig[label];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
          config.className
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{config.text}</span>
      </div>

      {/* Verified result: show earnings */}
      {label === "verified_result" && metadata?.amount && (
        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span>{formatCurrency(metadata.amount)}</span>
          {metadata.period && (
            <span className="text-emerald-500 dark:text-emerald-500/70 font-normal">/ {metadata.period}</span>
          )}
        </div>
      )}

      {/* Active offer: show commission */}
      {label === "active_offer" && metadata?.commission_percent && (
        <div className="inline-flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400">
          <span>{metadata.commission_percent}% comissão</span>
        </div>
      )}

      {/* Sponsored: show brand */}
      {label === "sponsored" && metadata?.brand_name && (
        <div className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-400">
          <span>por {metadata.brand_name}</span>
        </div>
      )}
    </div>
  );
}
