import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, Download, Search, Mail, Users, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WaitlistEntry {
  id: string;
  email: string;
  whatsapp: string | null;
  role: string;
  city: string | null;
  niche: string | null;
  created_at: string;
}

export function WaitlistPanel() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("waitlist" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setEntries(data as unknown as WaitlistEntry[]);
      setLoading(false);
    })();
  }, []);

  const filtered = entries.filter((e) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      e.email.toLowerCase().includes(s) ||
      (e.city ?? "").toLowerCase().includes(s) ||
      (e.niche ?? "").toLowerCase().includes(s) ||
      (e.whatsapp ?? "").includes(s)
    );
  });

  const creators = entries.filter((e) => e.role === "creator").length;
  const brands = entries.filter((e) => e.role === "brand").length;

  const exportCsv = () => {
    const rows = [
      ["email", "whatsapp", "perfil", "cidade", "nicho", "criado_em"],
      ...filtered.map((e) => [
        e.email,
        e.whatsapp ?? "",
        e.role,
        e.city ?? "",
        e.niche ?? "",
        new Date(e.created_at).toISOString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-onlyshop-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{entries.length}</p>
              <p className="text-xs text-muted-foreground uppercase">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-accent" />
            <div>
              <p className="text-2xl font-bold">{creators}</p>
              <p className="text-xs text-muted-foreground uppercase">Criadores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{brands}</p>
              <p className="text-xs text-muted-foreground uppercase">Marcas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-base">Inscritos na Waitlist</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar..."
                className="pl-8 h-9 w-56"
              />
            </div>
            <Button size="sm" variant="outline" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Nenhum inscrito ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Nicho</TableHead>
                    <TableHead>Quando</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.email}</TableCell>
                      <TableCell>
                        <Badge variant={e.role === "brand" ? "default" : "secondary"}>
                          {e.role === "creator" ? "Criador" : "Marca"}
                        </Badge>
                      </TableCell>
                      <TableCell>{e.whatsapp ?? "—"}</TableCell>
                      <TableCell>{e.city ?? "—"}</TableCell>
                      <TableCell>{e.niche ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(e.created_at), { addSuffix: true, locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
