import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Edit3, 
  MapPin, 
  Link2, 
  Calendar,
  Loader2,
  Grid3X3,
  Heart,
  Bookmark
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Profile() {
  const { user, profile, userRole, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        display_name: displayName,
        username: username,
        bio: bio,
      });
      setIsEditing(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSaving(false);
    }
  };

  const initials = profile?.display_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  const getRoleBadge = () => {
    const roleLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      viewer: { label: "Membro", variant: "secondary" },
      learner: { label: "Starter", variant: "outline" },
      affiliate: { label: "Partner", variant: "default" },
      agency: { label: "Business", variant: "default" },
      brand: { label: "PRO", variant: "default" },
    };

    const role = userRole?.role || "viewer";
    const config = roleLabels[role] || roleLabels.viewer;

    return (
      <Badge variant={config.variant} className={role === "brand" ? "bg-gradient-primary" : ""}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-primary relative">
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-2 right-2 h-8 w-8"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="pt-0 relative">
          {/* Avatar */}
          <div className="absolute -top-12 left-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end pt-2">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-primary"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar perfil
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="mt-8 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="seu_usuario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">
                    {profile?.display_name || "Usuário"}
                  </h1>
                  {getRoleBadge()}
                </div>
                <p className="text-muted-foreground">
                  @{profile?.username || "user"}
                </p>
                {profile?.bio && (
                  <p className="text-sm">{profile.bio}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Entrou{" "}
                      {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-bold">0</p>
              <p className="text-xs text-muted-foreground">Publicações</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">0</p>
              <p className="text-xs text-muted-foreground">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">0</p>
              <p className="text-xs text-muted-foreground">Seguindo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="posts" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="likes" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Curtidas</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Salvos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Você ainda não fez nenhuma publicação.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma curtida ainda.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum post salvo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
