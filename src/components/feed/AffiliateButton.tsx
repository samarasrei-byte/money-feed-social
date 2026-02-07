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

export function AffiliateButton({ 
  affiliateUrl, 
  productName, 
  commission,
  className 
}: AffiliateButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!affiliateUrl) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(affiliateUrl);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: productName ? `Link de ${productName} copiado` : "Link de afiliado copiado",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
      });
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-9 gap-2 rounded-full transition-all duration-300",
          "border-success/30 bg-success/10 text-success",
          "hover:bg-success hover:text-success-foreground hover:border-success",
          copied && "bg-success text-success-foreground"
        )}
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span>Copiado!</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            <span>Copiar Link</span>
            {commission && (
              <span className="text-xs opacity-80">({commission}%)</span>
            )}
          </>
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-muted"
        onClick={handleOpen}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
}
