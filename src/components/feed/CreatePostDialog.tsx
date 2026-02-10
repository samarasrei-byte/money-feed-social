import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Camera,
  Image as ImageIcon,
  Video,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  onPostCreated?: () => void;
}

export function CreatePostDialog({ onPostCreated }: CreatePostDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB max)
    if (file.size > 52428800) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo é 50MB",
      });
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast({
        variant: "destructive",
        title: "Formato não suportado",
        description: "Use imagens (JPG, PNG, WebP) ou vídeos (MP4, WebM)",
      });
      return;
    }

    setSelectedFile(file);
    setPostType(isVideo ? "video" : "image");

    // Create preview
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setPostType("text");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    setUploadProgress(10);

    const { data, error } = await supabase.storage
      .from("post-media")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    setUploadProgress(80);

    const { data: urlData } = supabase.storage
      .from("post-media")
      .getPublicUrl(data.path);

    setUploadProgress(100);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!content.trim() && !selectedFile) {
      toast({
        variant: "destructive",
        title: "Conteúdo vazio",
        description: "Adicione texto ou uma mídia ao seu post",
      });
      return;
    }

    setIsPosting(true);
    try {
      let mediaUrl: string | null = null;

      if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile);
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim() || (postType === "image" ? "📸" : "🎬"),
        post_type: postType,
        media_url: mediaUrl,
      });

      if (error) throw error;

      toast({
        title: "Publicado! 🎉",
        description: "Seu post está no feed",
      });

      // Reset
      setContent("");
      removeFile();
      setPostType("text");
      setUploadProgress(0);
      setIsOpen(false);
      onPostCreated?.();
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Erro ao publicar",
        description: error.message || "Tente novamente",
      });
    } finally {
      setIsPosting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-14 w-14 rounded-full bg-gradient-primary hover:opacity-90 shadow-lg glow-primary"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-center text-lg">Nova publicação</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Media Preview */}
          {preview && (
            <div className="relative rounded-xl overflow-hidden bg-muted">
              {postType === "image" ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-80 object-cover"
                />
              ) : (
                <video
                  src={preview}
                  className="w-full max-h-80 object-cover"
                  controls
                  playsInline
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Caption */}
          <Textarea
            placeholder="Escreva uma legenda..."
            className="min-h-[80px] resize-none border-0 focus-visible:ring-0 text-base p-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2200}
          />
          <p className="text-xs text-muted-foreground text-right -mt-2">
            {content.length}/2200
          </p>

          {/* Media Buttons */}
          {!selectedFile && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {/* Camera button */}
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="h-5 w-5 text-primary" />
                Câmera
              </Button>

              {/* Gallery button */}
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 text-accent" />
                Galeria
              </Button>

              {/* Video button */}
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "video/*";
                    fileInputRef.current.click();
                    // Reset accept after click
                    setTimeout(() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*,video/*";
                      }
                    }, 100);
                  }
                }}
              >
                <Video className="h-5 w-5 text-success" />
                Vídeo
              </Button>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Upload progress */}
          {isPosting && uploadProgress > 0 && (
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={(!content.trim() && !selectedFile) || isPosting}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
          >
            {isPosting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadProgress > 0 ? `Enviando ${uploadProgress}%...` : "Publicando..."}
              </span>
            ) : (
              "Compartilhar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
