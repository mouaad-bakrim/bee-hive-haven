import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {

  // عرض الموقع
  if (req.method === "GET") {
    return new Response(`
      <html>
      <head>
        <title>Bee Hive Haven 🐝</title>
      </head>

      <body style="font-family:Arial;text-align:center;margin-top:60px">

        <h1>🐝 Bee Hive Haven</h1>

        <p>Le serveur fonctionne correctement.</p>

        <p>API Chat disponible via POST.</p>

      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  // API Chat
  if (req.method === "POST") {
    const body = await req.json();

    return new Response(JSON.stringify({
      success: true,
      message: "API fonctionne",
      data: body
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  return new Response("Method not allowed", { status: 405 });

});