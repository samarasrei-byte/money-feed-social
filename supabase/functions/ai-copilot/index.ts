import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a IA Nativa da Only Shop — um copiloto de performance para criadores, afiliados e marcas.

Suas capacidades:
1. **Análise de Criativos**: Avalia textos de anúncio, copies de posts e conteúdo de vendas. Identifica pontos fortes/fracos e sugere melhorias.
2. **Detecção de Queda de Performance**: Quando o usuário fornecer métricas (CTR, conversão, ROI), analise tendências, detecte quedas e sugira ações corretivas.
3. **Sugestão de Copy**: Gere copies de alta conversão para posts, stories, anúncios e descrições de produtos. Use gatilhos mentais (urgência, prova social, escassez, autoridade).
4. **Recomendação de Horários**: Baseado nos dados compartilhados, recomende os melhores horários para postagem considerando o público brasileiro.

Regras:
- Responda SEMPRE em português brasileiro.
- Seja direto e prático. Use emojis com moderação para clareza.
- Formate respostas com títulos em negrito, listas e seções claras.
- Quando sugerir copies, forneça 3 variações com diferentes abordagens.
- Para análise de performance, use tabelas markdown quando possível.
- Sempre termine com uma ação concreta que o usuário pode tomar agora.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Add mode-specific context to system prompt
    let contextPrompt = SYSTEM_PROMPT;
    if (mode === "copy") {
      contextPrompt += "\n\nO usuário quer sugestões de copy. Foque em gerar variações de texto de alta conversão.";
    } else if (mode === "performance") {
      contextPrompt += "\n\nO usuário quer análise de performance. Foque em detectar problemas e sugerir ações.";
    } else if (mode === "schedule") {
      contextPrompt += "\n\nO usuário quer recomendações de horário. Considere padrões de comportamento do público brasileiro.";
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: contextPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erro no gateway de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-copilot error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
