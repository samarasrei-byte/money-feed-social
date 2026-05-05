import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2, X, Plus } from "lucide-react";

const SUGGESTED_NICHES = [
  "Moda", "Beleza", "Fitness", "Tech", "Casa", "Pet", "Infantil",
  "Gastronomia", "Viagem", "Esporte", "Saúde", "Educação", "Games", "Automotivo",
];

export function LocationNichesCard() {
  const { user } = useAuth();
  const { detectAndSave, saveLocation, loading: geoLoading } = useGeolocation();

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [niches, setNiches] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("city, state, niches, categories")
        .eq("user_id", user.id)
        .maybeSingle();
      const p = data as any;
      if (p) {
        setCity(p.city || "");
        setState(p.state || "");
        setNiches(p.niches || []);
        setCategories(p.categories || []);
      }
    })();
  }, [user]);

  const toggleNiche = (n: string) => {
    setNiches((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  };

  const addCategory = () => {
    const v = newCategory.trim();
    if (!v || categories.includes(v)) return;
    setCategories([...categories, v]);
    setNewCategory("");
  };

  const handleSaveAll = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase
        .from("profiles")
        .update({ city, state, niches, categories } as any)
        .eq("user_id", user.id);
      await saveLocation({ city, state });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Localização & Match
        </CardTitle>
        <CardDescription className="text-xs">
          Usado para sugerir afiliados e marcas próximas com nichos compatíveis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full text-xs gap-2"
          onClick={() => detectAndSave("profile")}
          disabled={geoLoading}
        >
          {geoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
          Detectar minha localização
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[11px] text-muted-foreground/50">Cidade</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="São Paulo"
              className="h-9 text-sm rounded-xl mt-1 border-border/20"
            />
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground/50">Estado</Label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="SP"
              className="h-9 text-sm rounded-xl mt-1 border-border/20"
            />
          </div>
        </div>

        <div>
          <Label className="text-[11px] text-muted-foreground/50">Nichos de atuação</Label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SUGGESTED_NICHES.map((n) => (
              <Badge
                key={n}
                variant={niches.includes(n) ? "default" : "outline"}
                className="cursor-pointer text-[11px]"
                onClick={() => toggleNiche(n)}
              >
                {n}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-[11px] text-muted-foreground/50">Categorias de interesse</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              placeholder="Ex: cosméticos veganos"
              className="h-9 text-sm rounded-xl border-border/20"
            />
            <Button size="sm" variant="outline" onClick={addCategory} className="rounded-xl h-9">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categories.map((c) => (
                <Badge key={c} variant="secondary" className="text-[11px] gap-1">
                  {c}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setCategories(categories.filter((x) => x !== c))}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          size="sm"
          className="w-full rounded-full bg-foreground text-background text-xs"
          onClick={handleSaveAll}
          disabled={saving}
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salvar"}
        </Button>
      </CardContent>
    </Card>
  );
}
