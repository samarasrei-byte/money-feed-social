import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onCreate: (data: any) => Promise<any>;
}

const CATEGORIES = ["Saúde", "Beleza", "Educação", "Tecnologia", "Finanças", "Fitness", "Alimentação", "Moda", "Outro"];

export function CreateProductSheet({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", commission_type: "percentage", commission_value: "", category: "", image_url: "",
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
        price: parseFloat(form.price) || 0,
        commission_type: form.commission_type,
        commission_value: parseFloat(form.commission_value) || 0,
        category: form.category || null,
        image_url: form.image_url || null,
        active: true,
        promo_materials: [],
      });
      toast({ title: "Produto criado!" });
      setForm({ name: "", description: "", price: "", commission_type: "percentage", commission_value: "", category: "", image_url: "" });
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
        <Button className="bg-gradient-primary border-0 text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> Novo Produto
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader><SheetTitle>Cadastrar Produto</SheetTitle></SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-6">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input placeholder="Nome do produto" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea placeholder="Descreva o produto..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => update("price", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo Comissão</Label>
              <Select value={form.commission_type} onValueChange={(v) => update("commission_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentual</SelectItem>
                  <SelectItem value="fixed">Fixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor Comissão</Label>
              <Input type="number" step="0.01" placeholder={form.commission_type === "percentage" ? "%" : "R$"} value={form.commission_value} onChange={(e) => update("commission_value", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL da Imagem</Label>
            <Input placeholder="https://..." value={form.image_url} onChange={(e) => update("image_url", e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary border-0 text-primary-foreground" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Produto"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
