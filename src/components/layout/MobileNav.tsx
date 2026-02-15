import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Trophy, User, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/create", icon: PlusCircle, label: "Criar", isAction: true },
  { href: "/ranking", icon: Trophy, label: "Ranking" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/40 safe-area-inset-bottom md:hidden">
      <div className="flex items-center justify-around h-12">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-[22px] w-[22px]", item.isAction && "text-primary")} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
