import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, User, PlusCircle, Flame, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/discover", icon: Sparkles, label: "Match" },
  { href: "/onlyshop", icon: ShoppingBag, label: "Only Shop" },
  { href: "/create", icon: PlusCircle, label: "", isAction: true },
  { href: "/trending", icon: Flame, label: "Em Alta" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export const MobileNav = memo(function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-area-inset-bottom md:hidden dark:shadow-[0_-4px_30px_-10px_hsl(330,81%,60%,0.08)]">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center justify-center tap"
              >
                <div className="h-10 w-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg will-change-transform">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-all duration-300 tap",
                isActive ? "text-foreground" : "text-muted-foreground/30"
              )}
            >
              <Icon className={cn("h-[22px] w-[22px] transition-transform duration-300", isActive && "scale-110 text-primary")} />
              <span className={cn("text-[9px] font-bold tracking-tight uppercase", isActive ? "text-foreground" : "opacity-40")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

MobileNav.displayName = "MobileNav";