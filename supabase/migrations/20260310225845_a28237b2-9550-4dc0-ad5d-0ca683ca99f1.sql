
-- Subscribers table for newsletter
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read subscribers" ON public.subscribers FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete subscribers" ON public.subscribers FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update subscribers" ON public.subscribers FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Forum questions table
CREATE TABLE public.forum_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published questions" ON public.forum_questions FOR SELECT USING (status = 'published' OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can ask questions" ON public.forum_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage questions" ON public.forum_questions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Forum answers table
CREATE TABLE public.forum_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  votes_up INTEGER NOT NULL DEFAULT 0,
  votes_down INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads answers" ON public.forum_answers FOR SELECT USING (true);
CREATE POLICY "Anyone can answer" ON public.forum_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage answers" ON public.forum_answers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Glossary terms table
CREATE TABLE public.glossary_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  letter CHAR(1) NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads glossary" ON public.glossary_terms FOR SELECT USING (true);
CREATE POLICY "Admins manage glossary" ON public.glossary_terms FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add bio and social links to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT '';

-- Add theme columns to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'amber';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'sans';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS border_radius_preset TEXT DEFAULT 'rounded';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'shadow';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS animation_speed TEXT DEFAULT 'normal';

-- RPC for voting on answers
CREATE OR REPLACE FUNCTION public.vote_answer(p_answer_id UUID, p_direction TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_direction = 'up' THEN
    UPDATE public.forum_answers SET votes_up = votes_up + 1 WHERE id = p_answer_id;
  ELSIF p_direction = 'down' THEN
    UPDATE public.forum_answers SET votes_down = votes_down + 1 WHERE id = p_answer_id;
  END IF;
END;
$$;
