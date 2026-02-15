import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Edit3, Calendar, Loader2, Grid3X3, Heart, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Profile() {
  const { user, profile, userRole, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = async () => {
    setIsSaving(true);
    try { await updateProfile({ display_name: displayName, username, bio }); setIsEditing(false); } catch {} finally { setIsSaving(false); }
  };

  const initials = profile?.display_name?.split(" ").map(n => n[0]).join("").toUpperCase() || user.email?.[0].toUpperCase() || "U";
  const roleLabels: Record<string, string> = { viewer: "Membro", learner: "Starter", affiliate: "Partner", agency: "Business", brand: "PRO" };
  const role = userRole?.role || "viewer";

  return (
    <div className="max-w-lg mx-auto py-6 space-y-5">
      {/* Profile Card */}
      <div className="mx-4">
        {/* Cover */}
        <div className="h-28 rounded-t-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/[0.02] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
          <Button size="icon" variant="ghost" className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-background/60 backdrop-blur-xl">
            <Camera className="h-3 w-3" />
          </Button>
        </div>

        <div className="px-4 pb-5 bg-background border-x border-b border-border/20 rounded-b-2xl relative">
          {/* Avatar */}
          <div className="absolute -top-10 left-4">
            <div className="relative">
              <div className="rounded-full p-[2px] bg-gradient-to-br from-accent via-primary to-purple-500">
                <Avatar className="h-20 w-20 border-[3px] border-background">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-muted text-foreground text-lg font-bold">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <Button size="icon" className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-foreground text-background">
                <Camera className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Edit */}
          <div className="flex justify-end pt-2">
            {isEditing ? (
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] rounded-full" onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button size="sm" className="h-7 text-[11px] rounded-full bg-foreground text-background" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salvar"}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-full border-border/30" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-3 w-3 mr-1" />Editar
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <div><Label className="text-[11px] text-muted-foreground/50">Nome</Label><Input className="h-9 text-sm rounded-xl mt-1 border-border/20" value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
                <div><Label className="text-[11px] text-muted-foreground/50">Usuário</Label><Input className="h-9 text-sm rounded-xl mt-1 border-border/20" value={username} onChange={e => setUsername(e.target.value)} /></div>
                <div><Label className="text-[11px] text-muted-foreground/50">Bio</Label><Textarea className="text-sm rounded-xl resize-none mt-1 border-border/20" rows={2} value={bio} onChange={e => setBio(e.target.value)} /></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight">{profile?.display_name || "Usuário"}</h1>
                  <Badge variant="secondary" className="text-[9px] rounded-full bg-muted/50 text-muted-foreground/50 border-0">{roleLabels[role]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground/40">@{profile?.username || "user"}</p>
                {profile?.bio && <p className="text-xs leading-relaxed text-foreground/70">{profile.bio}</p>}
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/30">
                  <Calendar className="h-3 w-3" />
                  Entrou {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ptBR })}
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/15">
            {[["0","Publicações"],["0","Seguidores"],["0","Seguindo"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-sm font-bold">{v}</p>
                <p className="text-[10px] text-muted-foreground/30">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-9 p-0.5 bg-muted/30 rounded-full border-0">
            {([["posts",Grid3X3,"Posts"],["likes",Heart,"Curtidas"],["saved",Bookmark,"Salvos"]] as const).map(([val,Icon,label]) => (
              <TabsTrigger key={val} value={val} className="gap-1.5 text-[11px] h-8 rounded-full data-[state=active]:shadow-none">
                <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {["posts","likes","saved"].map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="py-16 text-center"><p className="text-xs text-muted-foreground/30">Nenhum conteúdo ainda.</p></div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
