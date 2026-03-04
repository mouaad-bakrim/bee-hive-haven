import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Tu es l'assistant du "Coin des Apiculteurs", un blog communautaire francophone dédié à l'apiculture.
Tu réponds toujours en français, avec un ton professionnel, bienveillant et passionné.
Tu es expert en apiculture : ruches, abeilles, miel, varroa, récolte, santé des colonies, apithérapie, propolis, gelée royale, pollen.
Tu donnes des conseils pratiques, tu encourages les débutants, et tu partages ta passion.
Si on te pose une question hors-sujet, ramène poliment la conversation vers l'apiculture.
Utilise des emojis 🐝🍯🌼 avec parcimonie pour rester chaleureux.`;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only POST accepted
  if (req.method !== "POST") {
    return jsonResponse(
      { error: 'Utilisez POST avec un body JSON: {"messages":[...]}' },
      405
    );
  }

  try {
    // Safe JSON parsing (avoids "Unexpected end of JSON input")
    const raw = await req.text();
    if (!raw) {
      return jsonResponse(
        { error: 'Body JSON manquant. Exemple: {"messages":[{"role":"user","content":"Bonjour"}]}' },
        400
      );
    }

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch {
      return jsonResponse({ error: "Body invalide (JSON)." }, 400);
    }

    const messages = payload?.messages;
    if (!Array.isArray(messages)) {
      return jsonResponse(
        { error: "Champ 'messages' requis et doit être un tableau." },
        400
      );
    }

    const safeMessages: ChatMessage[] = messages
      .filter(
        (m: any) =>
          m &&
          typeof m === "object" &&
          (m.role === "user" || m.role === "assistant" || m.role === "system") &&
          typeof m.content === "string"
      )
      .slice(-12);

    if (safeMessages.length === 0) {
      return jsonResponse(
        { error: "Le tableau 'messages' est vide ou invalide." },
        400
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return jsonResponse({ error: "LOVABLE_API_KEY is not configured" }, 500);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return jsonResponse(
          { error: "Trop de requêtes, réessayez dans un instant." },
          429
        );
      }
      if (response.status === 402) {
        return jsonResponse({ error: "Crédits IA épuisés." }, 402);
      }

      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return jsonResponse({ error: "Erreur du service IA" }, 500);
    }

    // SSE streaming back to client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Erreur inconnue" },
      500
    );
  }
});