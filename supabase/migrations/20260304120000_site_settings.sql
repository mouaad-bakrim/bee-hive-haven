-- Site settings: single row (id=1) for header/footer.
-- Run after the base migration that creates update_updated_at().

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT,
  slogan TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Trigger: keep updated_at on UPDATE (uses function from first migration)
DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Ensure the single row exists
INSERT INTO public.site_settings (id, site_name, slogan, instagram_url, facebook_url)
VALUES (
  1,
  'Coin des Apiculteurs',
  'Ruches, miel et passion — faisons grandir nos colonies ensemble 🐝',
  'https://instagram.com',
  'https://facebook.com'
)
ON CONFLICT (id) DO NOTHING;

-- RLS: public read, authenticated write
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can insert site settings" ON public.site_settings;
CREATE POLICY "Authenticated can insert site settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND id = 1);

DROP POLICY IF EXISTS "Authenticated can update site settings" ON public.site_settings;
CREATE POLICY "Authenticated can update site settings"
  ON public.site_settings FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (id = 1);
