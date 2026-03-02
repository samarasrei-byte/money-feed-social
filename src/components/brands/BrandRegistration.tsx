import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Globe, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

interface Props {
  onRegister: (data: { name: string; slug: string; description?: string; logo_url?: string; website?: string }) => Promise<any>;
}

export function BrandRegistration({ onRegister }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setLoading(true);
    try {
      await onRegister({
        name,
        slug,
        description: description || undefined,
        logo_url: logoUrl || undefined,
        website: website || undefined,
      });
      toast({ title: "Marca cadastrada!", description: "Sua marca foi criada com sucesso." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Cadastrar sua Marca</CardTitle>
          <CardDescription>Comece a oferecer seus produtos para milhares de afiliados</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                folder="logos"
                aspectRatio="aspect-square"
                className="w-28"
                placeholder="Logo"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome da Marca *</Label>
              <Input placeholder="Ex: Minha Marca" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL) *</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>onlyshop.app/marca/</span>
                <Input placeholder="minha-marca" value={slug} onChange={(e) => setSlug(e.target.value)} required className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea placeholder="Fale sobre sua marca..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> Website</Label>
              <Input placeholder="https://suamarca.com.br" value={website} onChange={(e) => setWebsite(e.target.value)} type="url" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary border-0 text-primary-foreground" size="lg" disabled={loading}>
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Cadastrando..." : "Cadastrar Marca"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
