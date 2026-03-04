-- Comments for article (post) pages. article_id references posts.id.

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Index for listing comments by article
CREATE INDEX IF NOT EXISTS comments_article_id_idx ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);

-- RLS: public read and insert; only admin update/delete
CREATE POLICY "Public can read comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Public can insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update comments"
  ON public.comments FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete comments"
  ON public.comments FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
