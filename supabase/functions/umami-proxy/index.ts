import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UMAMI_API = "https://api.umami.is/v1";
const WEBSITE_ID = "2993a549-0d05-4120-ab59-e48c40965bbc";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const token = Deno.env.get("UMAMI_API_TOKEN");
  if (!token) {
    return new Response(JSON.stringify({ error: "UMAMI_API_TOKEN not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { endpoint, params } = await req.json();

    // Allowed endpoints
    const allowed = ["stats", "pageviews", "metrics", "active"];
    if (!allowed.includes(endpoint)) {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let url: string;
    if (endpoint === "active") {
      url = `${UMAMI_API}/websites/${WEBSITE_ID}/active`;
    } else {
      const qs = new URLSearchParams(params || {}).toString();
      url = `${UMAMI_API}/websites/${WEBSITE_ID}/${endpoint}${qs ? `?${qs}` : ""}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
