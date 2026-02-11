import { Users, Search } from "lucide-react";

interface CommunityEmptyStateProps {
  hasSearch: boolean;
}

export function CommunityEmptyState({ hasSearch }: CommunityEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {hasSearch ? (
          <Search className="h-7 w-7 text-muted-foreground" />
        ) : (
          <Users className="h-7 w-7 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        {hasSearch ? "Nenhum resultado" : "Nenhuma comunidade"}
      </p>
      <p className="text-xs text-muted-foreground max-w-[240px]">
        {hasSearch
          ? "Tente buscar com outro termo"
          : "Seja o primeiro a criar uma comunidade e reunir sua tribo!"}
      </p>
    </div>
  );
}
