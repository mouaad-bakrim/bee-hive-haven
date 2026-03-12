import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getArticlesAdmin, deleteArticle } from "@/features/articles/articles.api";
import type { PostRow } from "@/features/articles/articles.api";

const categories = ["all", "actualite", "sante", "cours", "histoires", "buzz"];
const catLabels: Record<string, string> = {
  all: "Tous",
  actualite: "Actualité",
  sante: "Santé",
  cours: "Cours",
  histoires: "Histoires",
  buzz: "Buzz",
};

export default function PostsList() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getArticlesAdmin();
      setPosts(data);
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.message || "Impossible de charger les articles.", variant: "destructive" });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    try {
      await deleteArticle(id);
      toast({ title: "Article supprimé" });
      fetchPosts();
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.message || "Suppression impossible", variant: "destructive" });
    }
  };

  const filtered = posts.filter((p) => {
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">Articles</h1>
        <Link to="/admin/posts/new">
          <Button className="honey-gradient text-primary-foreground gap-1.5 min-h-[44px] w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Nouveau
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground min-h-[44px]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{catLabels[c]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground min-h-[44px]"
        >
          <option value="all">Tous statuts</option>
          <option value="draft">Brouillons</option>
          <option value="published">Publiés</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground">Titre</th>
                <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Catégorie</th>
                <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Statut</th>
                <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Vues</th>
                <th className="text-left px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-3 sm:px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-4"><div className="h-5 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    Aucun article trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {post.cover_url && (
                          <img src={post.cover_url} alt="" className="w-8 h-6 sm:w-10 sm:h-7 rounded object-cover flex-shrink-0" />
                        )}
                        <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-[250px]">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold capitalize">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        post.status === "published"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {post.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-muted-foreground hidden lg:table-cell">{post.views || 0}</td>
                    <td className="px-3 sm:px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(post.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Link to={`/article/${post.slug}`} target="_blank"
                          className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/posts/${post.id}/edit`}
                          className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
