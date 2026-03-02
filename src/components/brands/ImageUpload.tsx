import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  aspectRatio?: string;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, folder, aspectRatio = "aspect-square", className = "", placeholder = "Upload imagem" }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Arquivo inválido", description: "Selecione uma imagem" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "Máximo 5MB" });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${folder}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from("brand-assets").upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("brand-assets").getPublicUrl(path);
      onChange(publicUrl);
      toast({ title: "Imagem enviada!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro no upload", description: err.message });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      {value ? (
        <div className={`relative ${aspectRatio} rounded-xl overflow-hidden border border-border/50 bg-muted/20`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-full"
            onClick={() => onChange(null)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full ${aspectRatio} rounded-xl border-2 border-dashed border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground/50`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-xs">{placeholder}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
