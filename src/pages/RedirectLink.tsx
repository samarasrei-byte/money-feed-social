import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function RedirectLink() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      if (!code) { setError(true); return; }

      try {
        const { data: link } = await supabase
          .from("affiliate_links")
          .select("id, destination_url")
          .eq("short_code", code)
          .single();

        if (!link) { setError(true); return; }

        // Record click (fire-and-forget)
        supabase.from("link_clicks").insert({
          affiliate_link_id: link.id,
          user_agent: navigator.userAgent,
          referer: document.referrer || null,
        }).then(() => {});

        // Redirect immediately
        window.location.href = link.destination_url;
      } catch {
        setError(true);
      }
    };

    redirect();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-lg font-bold">Link não encontrado</p>
        <p className="text-sm text-muted-foreground">Este link é inválido ou foi removido.</p>
        <button onClick={() => navigate("/")} className="text-sm text-primary underline mt-2">Voltar ao início</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
