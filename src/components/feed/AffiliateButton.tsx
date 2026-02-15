import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AffiliateButtonProps {
  affiliateUrl?: string;
  productName?: string;
  commission?: number;
  className?: string;
}

export function AffiliateButton({ affiliateUrl, productName, commission, className }: AffiliateButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!affiliateUrl) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(affiliateUrl);
      setCopied(true);
      toast({ title: "Link copiado!", description: productName ? `Link de ${productName}` : "Link de afiliado copiado" });
      setTimeout(() => setCopied(false), 2000);
    } catch { toast({ variant: "destructive", title: "Erro ao copiar" }); }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-7 gap-1.5 rounded-full text-[11px] font-medium transition-all border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
          copied && "bg-emerald-500 text-white border-emerald-500"
        )}
        onClick={handleCopy}
      >
        {copied ? <><Check className="h-3 w-3" />Copiado!</> : <><Link2 className="h-3 w-3" />Copiar Link{commission && <span className="opacity-60">({commission}%)</span>}</>}
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={handleOpen}>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  );
}
