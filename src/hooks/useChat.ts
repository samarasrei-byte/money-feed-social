import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Conversation {
  id: string;
  updatedAt: string;
  participant: {
    userId: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string;
  mediaUrl?: string;
  createdAt: string;
  readAt?: string;
}

export function useChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get all conversations the user is part of
      const { data: participations } = await supabase
        .from("conversation_participants")
        .select("conversation_id, last_read_at")
        .eq("user_id", user.id);

      if (!participations || participations.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const convIds = participations.map((p) => p.conversation_id);
      const lastReadMap = new Map(participations.map((p) => [p.conversation_id, p.last_read_at]));

      // Get conversations
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, updated_at")
        .in("id", convIds)
        .order("updated_at", { ascending: false });

      if (!convs) { setConversations([]); setLoading(false); return; }

      // Get other participants
      const { data: allParticipants } = await supabase
        .from("conversation_participants")
        .select("conversation_id, user_id")
        .in("conversation_id", convIds)
        .neq("user_id", user.id);

      const otherUserIds = [...new Set(allParticipants?.map((p) => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", otherUserIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      const participantMap = new Map(
        allParticipants?.map((p) => [p.conversation_id, p.user_id]) || []
      );

      // Get last message for each conversation
      const lastMessages: Map<string, any> = new Map();
      for (const conv of convs) {
        const { data: msgs } = await supabase
          .from("messages")
          .select("content, sender_id, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1);
        if (msgs && msgs.length > 0) lastMessages.set(conv.id, msgs[0]);
      }

      // Count unread
      const unreadCounts: Map<string, number> = new Map();
      for (const conv of convs) {
        const lastRead = lastReadMap.get(conv.id);
        if (lastRead) {
          const { count } = await supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .neq("sender_id", user.id)
            .gt("created_at", lastRead);
          unreadCounts.set(conv.id, count || 0);
        }
      }

      const mapped: Conversation[] = convs.map((conv) => {
        const otherUserId = participantMap.get(conv.id) || "";
        const profile = profileMap.get(otherUserId);
        const lastMsg = lastMessages.get(conv.id);
        return {
          id: conv.id,
          updatedAt: conv.updated_at,
          participant: {
            userId: otherUserId,
            username: profile?.username || "user",
            displayName: profile?.display_name || "Usuário",
            avatarUrl: profile?.avatar_url || undefined,
          },
          lastMessage: lastMsg ? {
            content: lastMsg.content,
            senderId: lastMsg.sender_id,
            createdAt: lastMsg.created_at,
          } : undefined,
          unreadCount: unreadCounts.get(conv.id) || 0,
        };
      });

      setConversations(mapped);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startConversation = useCallback(async (otherUserId: string) => {
    if (!user) return null;

    // Check if conversation already exists
    const { data: myConvs } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (myConvs) {
      for (const mc of myConvs) {
        const { data: otherP } = await supabase
          .from("conversation_participants")
          .select("id")
          .eq("conversation_id", mc.conversation_id)
          .eq("user_id", otherUserId)
          .limit(1);
        if (otherP && otherP.length > 0) return mc.conversation_id;
      }
    }

    // Create new conversation
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({})
      .select("id")
      .single();

    if (error || !conv) return null;

    await supabase.from("conversation_participants").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: otherUserId },
    ]);

    await fetchConversations();
    return conv.id;
  }, [user, fetchConversations]);

  return { conversations, loading, fetchConversations, startConversation };
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) return;
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(100);

    setMessages(
      (data || []).map((m) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        content: m.content,
        messageType: m.message_type,
        mediaUrl: m.media_url || undefined,
        createdAt: m.created_at,
        readAt: m.read_at || undefined,
      }))
    );
    setLoading(false);

    // Mark as read
    await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const m = payload.new as any;
          setMessages((prev) => [
            ...prev,
            {
              id: m.id,
              conversationId: m.conversation_id,
              senderId: m.sender_id,
              content: m.content,
              messageType: m.message_type,
              mediaUrl: m.media_url || undefined,
              createdAt: m.created_at,
              readAt: m.read_at || undefined,
            },
          ]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !user || !content.trim()) return;
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
    });
  }, [conversationId, user]);

  return { messages, loading, sendMessage, fetchMessages };
}
