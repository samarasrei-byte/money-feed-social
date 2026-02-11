import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const THEME_OPTIONS = [
  { id: "affiliates", label: "Afiliados", icon: "💰" },
  { id: "hot-products", label: "Produtos Quentes", icon: "🔥" },
  { id: "live-commerce", label: "Live Commerce", icon: "📺" },
  { id: "scale", label: "Escala", icon: "📈" },
  { id: "b2b", label: "B2B", icon: "🏢" },
];

interface CreateCommunitySheetProps {
  onCreated: () => void;
}

export function CreateCommunitySheet({ onCreated }: CreateCommunitySheetProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", theme: "" });

  if (!user) return null;

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from("communities")
        .insert({
          name: form.name.trim(),
          description: form.description.trim() || null,
          creator_id: user.id,
          theme: form.theme || null,
        } as any)
        .select()
        .single();

      if (error) throw error;

      await supabase.from("community_members").insert({
        community_id: data.id,
        user_id: user.id,
      });

      toast({ title: "Comunidade criada! 🎉" });
      setForm({ name: "", description: "", theme: "" });
      setOpen(false);
      onCreated();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-gradient-primary rounded-full h-9 px-4 text-xs font-semibold border-0">
          <Plus className="h-4 w-4" />
          Criar
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Nova Comunidade</SheetTitle>
          <SheetDescription>Crie um espaço para reunir sua tribo</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 py-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</Label>
            <Input
              placeholder="Ex: Afiliados de Tecnologia"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              maxLength={60}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</Label>
            <Textarea
              placeholder="Sobre o que é essa comunidade?"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              maxLength={200}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tema</Label>
            <div className="flex gap-2 flex-wrap">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm((p) => ({ ...p, theme: p.theme === t.id ? "" : t.id }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    form.theme === t.id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="rounded-full">Cancelar</Button>
          </SheetClose>
          <Button
            onClick={handleCreate}
            disabled={!form.name.trim() || isCreating}
            className="bg-gradient-primary rounded-full border-0"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Comunidade"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
