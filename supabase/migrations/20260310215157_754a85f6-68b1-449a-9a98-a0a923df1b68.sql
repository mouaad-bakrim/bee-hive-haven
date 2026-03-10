-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  site_name text,
  slogan text,
  instagram_url text,
  facebook_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Public reads settings" ON public.site_settings
  FOR SELECT TO public USING (true);

-- Admins can update/insert settings
CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL TO public
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default row
INSERT INTO public.site_settings (id, site_name, slogan, instagram_url, facebook_url)
VALUES (1, 'Coin des Apiculteurs', 'Ruches, miel et passion — faisons grandir nos colonies ensemble 🐝', 'https://instagram.com', 'https://facebook.com')
ON CONFLICT (id) DO NOTHING;