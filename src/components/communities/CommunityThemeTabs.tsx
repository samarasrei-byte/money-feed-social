import { cn } from "@/lib/utils";

const THEMES = [
  { id: null, label: "Todas", icon: "🌐" },
  { id: "affiliates", label: "Afiliados", icon: "💰" },
  { id: "hot-products", label: "Produtos Quentes", icon: "🔥" },
  { id: "live-commerce", label: "Live Commerce", icon: "📺" },
  { id: "scale", label: "Escala", icon: "📈" },
  { id: "b2b", label: "B2B", icon: "🏢" },
] as const;

interface CommunityThemeTabsProps {
  selected: string | null;
  onChange: (theme: string | null) => void;
}

export function CommunityThemeTabs({ selected, onChange }: CommunityThemeTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar px-4">
      {THEMES.map((theme) => {
        const isActive = selected === theme.id;
        return (
          <button
            key={theme.id ?? "all"}
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted text-muted-foreground active:scale-95"
            )}
          >
            <span className="text-base">{theme.icon}</span>
            <span>{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
}
