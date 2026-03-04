import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {

  // عرض الصفحة فالمتصفح
  if (req.method === "GET") {
    return new Response(`
      <html>
      <head>
        <title>Bee Hive Haven 🐝</title>
      </head>
      <body style="font-family:Arial;text-align:center;margin-top:50px">
        <h1>🐝 Bee Hive Haven API</h1>
        <p>Le serveur fonctionne correctement.</p>
        <p>Utilisez POST / pour envoyer un message au chat AI.</p>
      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    return new Response(
      JSON.stringify({
        reply: "API fonctionne 👍"
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Erreur JSON" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});