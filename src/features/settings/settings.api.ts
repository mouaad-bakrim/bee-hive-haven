import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  id: number;
  site_name: string | null;
  slogan: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaveSiteSettingsInput {
  site_name: string;
  slogan: string;
  instagram_url: string;
  facebook_url: string;
}

export async function getSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}

export async function saveSettings(input: SaveSiteSettingsInput): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        site_name: input.site_name,
        slogan: input.slogan,
        instagram_url: input.instagram_url,
        facebook_url: input.facebook_url,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

