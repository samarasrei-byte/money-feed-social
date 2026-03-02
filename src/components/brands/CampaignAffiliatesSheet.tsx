import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Affiliate {
  id: string;
  user_id: string;
  status: string;
  applied_at: string;
  profile?: { display_name: string | null; username: string | null; avatar_url: string | null };
}

interface Props {
  campaignId: string;
  campaignName: string;
}

export function CampaignAffiliatesSheet({ campaignId, campaignName }: Props) {
  const [open, setOpen] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAffiliates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("campaign_affiliates")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("applied_at", { ascending: false });

    if (data) {
      const userIds = data.map((a) => a.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]));
      setAffiliates(
        data.map((a) => ({ ...a, profile: profileMap.get(a.user_id) || undefined }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchAffiliates();
  }, [open]);

  const updateStatus = async (id: string, status: string) => {
    const updateData: any = { status };
    if (status === "approved") updateData.approved_at = new Date().toISOString();
    
    const { error } = await supabase.from("campaign_affiliates").update(updateData).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } else {
      toast({ title: status === "approved" ? "Afiliado aprovado!" : "Afiliado rejeitado" });
      setAffiliates((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  };

  const pending = affiliates.filter((a) => a.status === "pending");
  const approved = affiliates.filter((a) => a.status === "approved");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
          <Users className="h-3 w-3 mr-1" /> {affiliates.length || ""}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-sm">Afiliados — {campaignName}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 pb-6">
          {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : affiliates.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Nenhum afiliado inscrito</p>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendentes ({pending.length})</p>
                  {pending.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/10">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={a.profile?.avatar_url || ""} />
                        <AvatarFallback className="text-xs">{(a.profile?.display_name || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.profile?.display_name || a.profile?.username || "Usuário"}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(a.applied_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-success" onClick={() => updateStatus(a.id, "approved")}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateStatus(a.id, "rejected")}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {approved.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aprovados ({approved.length})</p>
                  {approved.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/30">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={a.profile?.avatar_url || ""} />
                        <AvatarFallback className="text-xs">{(a.profile?.display_name || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.profile?.display_name || a.profile?.username || "Usuário"}</p>
                      </div>
                      <Badge className="bg-success/10 text-success border-0 text-[10px]">Aprovado</Badge>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
