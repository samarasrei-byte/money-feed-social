import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquarePlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, loading, onSelect }: ConversationListProps) {
  if (loading) {
    return (
      <div className="divide-y divide-border/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <MessageSquarePlus className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Nenhuma conversa ainda. Visite o perfil de alguém para iniciar uma conversa!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/30">
      {conversations.map((conv) => {
        const initials = (conv.participant.displayName || "U")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="relative shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conv.participant.avatarUrl} />
                <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {conv.unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gradient-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm truncate">
                  {conv.participant.displayName}
                </span>
                {conv.lastMessage && (
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                      addSuffix: false,
                      locale: ptBR,
                    })}
                  </span>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {conv.lastMessage.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
