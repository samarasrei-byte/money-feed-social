import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Trophy,
  Loader2,
  Link2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { validateMediaUrl, validateAffiliateUrl } from "@/lib/urlValidation";

interface CreatePostSheetProps {
  onPostCreated?: () => void;
}

export function CreatePostSheet({ onPostCreated }: CreatePostSheetProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    // Validate media URL if provided
    if (mediaUrl) {
      const mediaValidation = validateMediaUrl(mediaUrl);
      if (!mediaValidation.isValid) {
        toast({
          variant: "destructive",
          title: "URL de mídia inválida",
          description: mediaValidation.error,
        });
        return;
      }
    }

    // Validate affiliate URL if provided
    if (affiliateUrl) {
      const affiliateValidation = validateAffiliateUrl(affiliateUrl);
      if (!affiliateValidation.isValid) {
        toast({
          variant: "destructive",
          title: "Link de afiliado inválido",
          description: affiliateValidation.error,
        });
        return;
      }
    }

    setIsPosting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim(),
        post_type: postType,
        media_url: mediaUrl || null,
      });

      if (error) throw error;

      toast({
        title: "Publicado!",
        description: "Seu post foi publicado com sucesso",
      });

      setContent("");
      setMediaUrl("");
      setAffiliateUrl("");
      setPostType("text");
      setIsOpen(false);
      onPostCreated?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível publicar",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const postTypes = [
    { type: "text" as const, icon: Type, label: "Texto" },
    { type: "image" as const, icon: ImageIcon, label: "Imagem" },
    { type: "video" as const, icon: Video, label: "Vídeo" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="h-14 w-14 rounded-full bg-gradient-primary hover:opacity-90 shadow-lg glow-primary"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-xl">Criar publicação</SheetTitle>
          <SheetDescription>
            Compartilhe sua estratégia, resultado ou conteúdo
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto pb-20">
          {/* Post Type Selector */}
          <div className="flex gap-2">
            {postTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setPostType(type)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                  postType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <Textarea
              placeholder="O que você quer compartilhar?"
              className="min-h-[120px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/500
            </p>
          </div>

          {/* Media URL (for image/video) */}
          {(postType === "image" || postType === "video") && (
            <div className="space-y-2">
              <Label>URL da mídia</Label>
              <Input
                placeholder={`Cole a URL ${postType === "image" ? "da imagem" : "do vídeo"}`}
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
              {mediaUrl && postType === "image" && (
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={mediaUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Affiliate Link */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Link de afiliado (opcional)
            </Label>
            <Input
              placeholder="Cole seu link de afiliado"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex gap-3 w-full">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">
                Cancelar
              </Button>
            </SheetClose>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isPosting}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {isPosting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Publicar"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
