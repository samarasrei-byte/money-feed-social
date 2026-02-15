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

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = async () => {
    setIsSaving(true);
    try { await updateProfile({ display_name: displayName, username, bio }); setIsEditing(false); } catch {} finally { setIsSaving(false); }
  };

  const initials = profile?.display_name?.split(" ").map(n => n[0]).join("").toUpperCase() || user.email?.[0].toUpperCase() || "U";

  const roleLabels: Record<string, string> = { viewer: "Membro", learner: "Starter", affiliate: "Partner", agency: "Business", brand: "PRO" };
  const role = userRole?.role || "viewer";

  return (
    <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
      {/* Profile Header */}
      <div className="rounded-xl border border-border/30 overflow-hidden bg-background">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5 relative">
          <Button size="icon" variant="ghost" className="absolute bottom-1.5 right-1.5 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="px-4 pb-4 relative">
          {/* Avatar */}
          <div className="absolute -top-10 left-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-[3px] border-background">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-muted text-foreground text-lg font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground">
                <Camera className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Edit */}
          <div className="flex justify-end pt-2">
            {isEditing ? (
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg" onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button size="sm" className="h-7 text-xs rounded-lg bg-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salvar"}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-3 w-3 mr-1" />Editar
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <div><Label className="text-xs">Nome</Label><Input className="h-8 text-sm rounded-lg mt-1" value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
                <div><Label className="text-xs">Usuário</Label><Input className="h-8 text-sm rounded-lg mt-1" value={username} onChange={e => setUsername(e.target.value)} /></div>
                <div><Label className="text-xs">Bio</Label><Textarea className="text-sm rounded-lg resize-none mt-1" rows={2} value={bio} onChange={e => setBio(e.target.value)} /></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold">{profile?.display_name || "Usuário"}</h1>
                  <Badge variant="secondary" className="text-[10px] rounded-full">{roleLabels[role]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">@{profile?.username || "user"}</p>
                {profile?.bio && <p className="text-xs leading-relaxed">{profile.bio}</p>}
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Entrou {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ptBR })}
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-border/30">
            {[["0","Publicações"],["0","Seguidores"],["0","Seguindo"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-sm font-bold">{v}</p>
                <p className="text-[10px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-9 p-0.5 bg-muted/50 rounded-lg">
          {([["posts",Grid3X3,"Posts"],["likes",Heart,"Curtidas"],["saved",Bookmark,"Salvos"]] as const).map(([val,Icon,label]) => (
            <TabsTrigger key={val} value={val} className="gap-1.5 text-xs h-8 rounded-md">
              <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {["posts","likes","saved"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="py-12 text-center"><p className="text-xs text-muted-foreground">Nenhum conteúdo ainda.</p></div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
