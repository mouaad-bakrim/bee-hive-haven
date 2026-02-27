import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Send, Trash2, Eye, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { value: "actualite", label: "Actualité" },
  { value: "sante", label: "Santé" },
  { value: "cours", label: "Cours Gratuit" },
  { value: "histoires", label: "Histoires" },
  { value: "buzz", label: "Buzz" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  cover_url: string;
  featured: boolean;
  status: string;
  meta_title: string;
  meta_description: string;
}

const empty: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "actualite",
  tags: "",
  cover_url: "",
  featured: false,
  status: "draft",
  meta_title: "",
  meta_description: "",
};

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<PostForm>(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  useEffect(() => {
    if (!isEdit) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: data.category,
            tags: (data.tags || []).join(", "),
            cover_url: data.cover_url || "",
            featured: data.featured || false,
            status: data.status,
            meta_title: data.meta_title || "",
            meta_description: data.meta_description || "",
          });
        }
        setLoading(false);
      });
  }, [id, isEdit]);

  const handleChange = (field: keyof PostForm, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
      handleChange("cover_url", data.publicUrl);
    }
    setUploading(false);
  };

  const save = async (status?: string) => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: "Titre et slug requis", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      cover_url: form.cover_url,
      featured: form.featured,
      status: status || form.status,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      author_id: user?.id,
      ...(status === "published" && !isEdit ? { published_at: new Date().toISOString() } : {}),
    };

    if (isEdit) {
      if (status === "published" && form.status !== "published") {
        (payload as any).published_at = new Date().toISOString();
      }
      const { error } = await supabase.from("posts").update(payload).eq("id", id);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Article mis à jour ✓" });
        if (status) setForm((p) => ({ ...p, status }));
      }
    } else {
      const { error } = await supabase.from("posts").insert(payload);
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Article créé ✓" });
        navigate("/admin/posts");
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer définitivement cet article ?")) return;
    await supabase.from("posts").delete().eq("id", id);
    toast({ title: "Article supprimé" });
    navigate("/admin/posts");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/posts" className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-xl font-bold text-foreground">
          {isEdit ? "Modifier l'article" : "Nouvel article"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Titre</label>
              <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Titre de l'article" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Slug</label>
              <div className="flex gap-2">
                <Input value={form.slug} onChange={(e) => { setAutoSlug(false); handleChange("slug", e.target.value); }} placeholder="mon-article" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Extrait</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                placeholder="Court résumé (≤150 caractères)"
                maxLength={150}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">{form.excerpt.length}/150</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Contenu (HTML)</label>
              <textarea
                value={form.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="<h2>Titre</h2><p>Contenu...</p>"
                rows={16}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-heading font-bold text-foreground text-sm">SEO</h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Meta Title</label>
              <Input value={form.meta_title} onChange={(e) => handleChange("meta_title", e.target.value)} placeholder="Titre SEO (≤60 caractères)" maxLength={60} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => handleChange("meta_description", e.target.value)}
                placeholder="Description SEO (≤160 caractères)"
                maxLength={160}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-heading font-bold text-foreground text-sm">Publication</h2>
            <Button onClick={() => save("draft")} disabled={saving} variant="outline" className="w-full gap-1.5">
              <Save className="w-4 h-4" /> Enregistrer brouillon
            </Button>
            <Button onClick={() => save("published")} disabled={saving} className="w-full honey-gradient text-primary-foreground gap-1.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {form.status === "published" ? "Mettre à jour" : "Publier"}
            </Button>
            {isEdit && form.status === "published" && (
              <Button onClick={() => save("draft")} disabled={saving} variant="secondary" className="w-full gap-1.5">
                Dépublier
              </Button>
            )}
            {isEdit && (
              <Button onClick={handleDelete} variant="destructive" className="w-full gap-1.5">
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
            )}
            {isEdit && (
              <Link to={`/article/${form.slug}`} target="_blank" className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline">
                <Eye className="w-4 h-4" /> Prévisualiser
              </Link>
            )}
          </div>

          {/* Cover Image */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-heading font-bold text-foreground text-sm">Image de couverture</h2>
            {form.cover_url && (
              <img src={form.cover_url} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
            )}
            <Input value={form.cover_url} onChange={(e) => handleChange("cover_url", e.target.value)} placeholder="URL de l'image" />
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-input cursor-pointer hover:bg-secondary/30 transition-colors text-sm text-muted-foreground">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Upload…" : "Uploader une image"}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>

          {/* Category & Tags */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tags</label>
              <Input value={form.tags} onChange={(e) => handleChange("tags", e.target.value)} placeholder="miel, ruche, varroa" />
              <p className="text-xs text-muted-foreground mt-1">Séparés par des virgules</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm font-medium text-foreground">⭐ Article à la une</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
