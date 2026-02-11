import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Notification {
  id: string;
  type: string;
  actorId: string;
  postId?: string;
  read: boolean;
  createdAt: string;
  actor?: {
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return;

    const actorIds = [...new Set(data.map((n) => n.actor_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url")
      .in("user_id", actorIds);

    const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const mapped: Notification[] = data.map((n) => {
      const actor = profilesMap.get(n.actor_id);
      return {
        id: n.id,
        type: n.type,
        actorId: n.actor_id,
        postId: n.post_id || undefined,
        read: n.read,
        createdAt: n.created_at,
        actor: actor
          ? {
              username: actor.username || "user",
              displayName: actor.display_name || "Usuário",
              avatarUrl: actor.avatar_url || undefined,
            }
          : undefined,
      };
    });

    setNotifications(mapped);
    setUnreadCount(mapped.filter((n) => !n.read).length);
  }, [user]);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const n = payload.new as any;
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, username, display_name, avatar_url")
            .eq("user_id", n.actor_id)
            .limit(1);

          const actor = profiles?.[0];
          const notif: Notification = {
            id: n.id,
            type: n.type,
            actorId: n.actor_id,
            postId: n.post_id || undefined,
            read: false,
            createdAt: n.created_at,
            actor: actor
              ? {
                  username: actor.username || "user",
                  displayName: actor.display_name || "Usuário",
                  avatarUrl: actor.avatar_url || undefined,
                }
              : undefined,
          };

          setNotifications((prev) => [notif, ...prev]);
          setUnreadCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { notifications, unreadCount, markAllRead, refetch: fetchNotifications };
}
