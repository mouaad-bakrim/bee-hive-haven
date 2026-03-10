
-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public can insert comments
CREATE POLICY "Anyone can submit comments" ON public.comments FOR INSERT TO public WITH CHECK (true);

-- Public can read approved comments
CREATE POLICY "Public reads approved comments" ON public.comments FOR SELECT TO public
  USING (status = 'approved' OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can update comments (approve/spam)
CREATE POLICY "Admins update comments" ON public.comments FOR UPDATE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete comments
CREATE POLICY "Admins delete comments" ON public.comments FOR DELETE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  link TEXT
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can read/manage notifications
CREATE POLICY "Admins read notifications" ON public.admin_notifications FOR SELECT TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update notifications" ON public.admin_notifications FOR UPDATE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete notifications" ON public.admin_notifications FOR DELETE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert notifications
CREATE POLICY "System inserts notifications" ON public.admin_notifications FOR INSERT TO public
  WITH CHECK (true);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads categories" ON public.categories FOR SELECT TO public USING (true);

CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
