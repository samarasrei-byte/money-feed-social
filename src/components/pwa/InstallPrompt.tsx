import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptProps {
  className?: string;
  variant?: "default" | "compact" | "banner";
}

export function InstallPrompt({ className, variant = "default" }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setDismissed(true);
      }
    }

    // Check if iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    setDismissed(true);
  };

  // Don't show if installed, dismissed, or no prompt available (and not iOS)
  if (isInstalled || dismissed || (!deferredPrompt && !isIOS)) {
    return null;
  }

  if (variant === "compact") {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-2", className)}
        asChild
      >
        <Link to="/install">
          <Download className="h-4 w-4" />
          Instalar
        </Link>
      </Button>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50",
          "bg-card border rounded-2xl shadow-lg p-4",
          "animate-slide-up",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary-foreground">O</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Instale o Only Shop</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acesso rápido direto da sua tela inicial
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={handleDismiss}
          >
            Agora não
          </Button>
          {deferredPrompt ? (
            <Button
              size="sm"
              className="flex-1 bg-gradient-primary"
              onClick={handleInstall}
            >
              Instalar
            </Button>
          ) : (
            <Button size="sm" className="flex-1 bg-gradient-primary" asChild>
              <Link to="/install">Ver como</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Button
      className={cn("gap-2 bg-gradient-primary hover:opacity-90", className)}
      onClick={deferredPrompt ? handleInstall : undefined}
      asChild={!deferredPrompt}
    >
      {deferredPrompt ? (
        <>
          <Download className="h-4 w-4" />
          Instalar App
        </>
      ) : (
        <Link to="/install">
          <Download className="h-4 w-4" />
          Instalar App
        </Link>
      )}
    </Button>
  );
}
