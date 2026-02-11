import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/hooks/useBrand";

interface Props {
  products: Product[];
  onCreate: (data: any) => Promise<any>;
}

export function CreateCampaignSheet({ products, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", product_id: "", bonus_percentage: "", max_affiliates: "", ends_at: "",
  });
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await onCreate({
        name: form.name,
        description: form.description || null,
        product_id: form.product_id || null,
        bonus_percentage: parseFloat(form.bonus_percentage) || 0,
        max_affiliates: form.max_affiliates ? parseInt(form.max_affiliates) : null,
        ends_at: form.ends_at || null,
        status: "active",
      });
      toast({ title: "Campanha criada!" });
      setForm({ name: "", description: "", product_id: "", bonus_percentage: "", max_affiliates: "", ends_at: "" });
      setOpen(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-primary/20">
          <Megaphone className="h-4 w-4 mr-1" /> Nova Campanha
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader><SheetTitle>Criar Campanha</SheetTitle></SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-6">
          <div className="space-y-2">
            <Label>Nome da Campanha *</Label>
            <Input placeholder="Ex: Black Friday 2026" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea placeholder="Detalhes da campanha..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Produto vinculado</Label>
            <Select value={form.product_id} onValueChange={(v) => update("product_id", v)}>
              <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Bônus (%)</Label>
              <Input type="number" step="0.1" placeholder="0" value={form.bonus_percentage} onChange={(e) => update("bonus_percentage", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Máx. Afiliados</Label>
              <Input type="number" placeholder="Ilimitado" value={form.max_affiliates} onChange={(e) => update("max_affiliates", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data de Término</Label>
            <Input type="date" value={form.ends_at} onChange={(e) => update("ends_at", e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary border-0 text-primary-foreground" disabled={loading}>
            {loading ? "Criando..." : "Criar Campanha"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
