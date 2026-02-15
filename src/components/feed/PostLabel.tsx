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

const labelConfig: Record<PostLabelType, { icon: typeof BadgeCheck; text: string; bg: string; pill: string }> = {
  verified_result: {
    icon: BadgeCheck,
    text: "Resultado Verificado",
    bg: "bg-emerald-500/10 text-emerald-600",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  active_offer: {
    icon: ShoppingBag,
    text: "Oferta Ativa",
    bg: "bg-amber-500/10 text-amber-600",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
  sponsored: {
    icon: Megaphone,
    text: "Patrocinado",
    bg: "bg-violet-500/10 text-violet-600",
    pill: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
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
    <div className={cn("flex items-center gap-1.5 px-3 py-1", className)}>
      <div className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", config.bg)}>
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </div>

      {label === "verified_result" && metadata?.amount && (
        <div className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", config.pill)}>
          <TrendingUp className="h-2.5 w-2.5" />
          <span>{formatCurrency(metadata.amount)}</span>
          {metadata.period && <span className="opacity-60 font-normal">/{metadata.period}</span>}
        </div>
      )}

      {label === "active_offer" && metadata?.commission_percent && (
        <div className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", config.pill)}>
          {metadata.commission_percent}% comissão
        </div>
      )}

      {label === "sponsored" && metadata?.brand_name && (
        <div className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", config.pill)}>
          por {metadata.brand_name}
        </div>
      )}
    </div>
  );
}
