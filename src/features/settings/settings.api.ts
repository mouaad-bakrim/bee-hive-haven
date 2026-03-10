import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  id: number;
  site_name: string | null;
  slogan: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  google_analytics_id: string | null;
  umami_website_id: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  hero_image_url: string | null;
  newsletter_title: string | null;
  newsletter_subtitle: string | null;
  newsletter_enabled: boolean | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export async function getSettings(): Promise<SiteSettings | null> {
  const { data, error } = await (supabase as any)
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}

export async function saveSettings(input: Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>): Promise<SiteSettings> {
  const { data, error } = await (supabase as any)
    .from("site_settings")
    .upsert({ id: 1, ...input }, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as SiteSettings;
}
