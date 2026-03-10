import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Instagram, Twitter, Globe, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimePublishedArticles } from "@/hooks/useRealtimePublishedArticles";
import ArticleCard from "@/components/home/ArticleCard";
import { useMemo } from "react";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
}

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { articles } = useRealtimePublishedArticles({ orderBy: "published_at" });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["author-profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!id,
  });

  const authorArticles = useMemo(
    () => articles.filter((a) => (a as any).author_id === id),
    [articles, id]
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-4">🐝</p>
        <h1 className="font-heading text-2xl font-bold mb-4">Auteur introuvable</h1>
        <Link to="/" className="text-primary hover:underline">← Retour</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-xl border border-border p-8 text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name || ""} className="w-full h-full object-cover" />
            ) : (
              "🐝"
            )}
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {profile.display_name || "Apiculteur anonyme"}
          </h1>
          {profile.bio && (
            <p className="text-muted-foreground max-w-lg mx-auto mb-4">{profile.bio}</p>
          )}
          <div className="flex justify-center gap-3">
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {profile.instagram_url && (
              <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {profile.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <h2 className="font-heading text-xl font-bold text-foreground mb-6">
          Articles ({authorArticles.length})
        </h2>
        {authorArticles.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
            <p>Aucun article publié.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {authorArticles.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
