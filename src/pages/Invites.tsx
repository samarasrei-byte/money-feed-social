import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Inbox, Check, X, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Invite {
  id: string;
  brand_id: string;
  message: string | null;
  status: string;
  created_at: string;
  brand?: { name: string; logo_url: string | null; slug: string };
}

export default function Invites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("affiliate_invites")
      .select("id, brand_id, message, status, created_at")
      .eq("affiliate_user_id", user!.id)
      .order("created_at", { ascending: false });

    if (!data?.length) {
      setInvites([]);
      setLoading(false);
      return;
    }

    const brandIds = [...new Set(data.map((i) => i.brand_id))];
    const { data: brands } = await supabase
      .from("brands")
      .select("id, name, logo_url, slug")
      .in("id", brandIds);

    const merged = data.map((i) => ({
      ...i,
      brand: brands?.find((b) => b.id === i.brand_id),
    }));

    setInvites(merged as Invite[]);
    setLoading(false);
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase
      .from("affiliate_invites")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: status === "accepted" ? "Convite aceito! 🎉" : "Convite recusado",
      description: status === "accepted" ? "A marca foi notificada." : undefined,
    });
    load();
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-3 flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        <h1 className="font-bold">Convites de marcas</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : invites.length === 0 ? (
          <Card className="p-12 text-center bg-card/40 backdrop-blur-2xl border-white/10">
            <Inbox className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Nenhum convite ainda</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Complete seu perfil para aparecer no Smart Match das marcas.
            </p>
          </Card>
        ) : (
          invites.map((inv) => (
            <Card key={inv.id} className="p-4 bg-card/40 backdrop-blur-2xl border-white/10">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={inv.brand?.logo_url || undefined} />
                  <AvatarFallback>{inv.brand?.name?.[0] || "B"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold truncate">{inv.brand?.name || "Marca"}</h3>
                    <Badge
                      variant={
                        inv.status === "accepted"
                          ? "default"
                          : inv.status === "declined"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {inv.status === "pending" ? "Pendente" : inv.status === "accepted" ? "Aceito" : "Recusado"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(inv.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                  {inv.message && <p className="text-sm mt-2">{inv.message}</p>}

                  {inv.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => respond(inv.id, "accepted")} className="flex-1">
                        <Check className="w-4 h-4 mr-1" /> Aceitar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => respond(inv.id, "declined")} className="flex-1">
                        <X className="w-4 h-4 mr-1" /> Recusar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
