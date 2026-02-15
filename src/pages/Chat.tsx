import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatView } from "@/components/chat/ChatView";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const { user } = useAuth();
  const { conversations, loading, startConversation, fetchConversations } = useChat();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold">Mensagens</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Faça login para acessar suas mensagens e conversar com outros usuários.
        </p>
        <Button asChild className="bg-gradient-primary border-0 rounded-xl">
          <Link to="/auth">Entrar</Link>
        </Button>
      </div>
    );
  }

  if (activeConversationId) {
    const conv = conversations.find((c) => c.id === activeConversationId);
    return (
      <ChatView
        conversationId={activeConversationId}
        participant={conv?.participant}
        onBack={() => {
          setActiveConversationId(null);
          fetchConversations();
        }}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 py-4 border-b border-border/30">
        <h1 className="text-xl font-bold">Mensagens</h1>
      </div>
      <ConversationList
        conversations={conversations}
        loading={loading}
        onSelect={(id) => setActiveConversationId(id)}
      />
    </div>
  );
}
