
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS meta_description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_keywords text DEFAULT '',
  ADD COLUMN IF NOT EXISTS google_analytics_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS umami_website_id text DEFAULT '2993a549-0d05-4120-ab59-e48c40965bbc',
  ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS favicon_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#f59e0b',
  ADD COLUMN IF NOT EXISTS hero_image_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS newsletter_title text DEFAULT 'Inscrivez-vous à la newsletter',
  ADD COLUMN IF NOT EXISTS newsletter_subtitle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS newsletter_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS contact_email text DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '',
  ADD COLUMN IF NOT EXISTS address text DEFAULT '',
  ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS twitter_url text DEFAULT '';
