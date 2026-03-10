import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
  _count?: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from("categories").select("*").order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    // Get article counts per category from posts
    const { data: posts } = await supabase.from("posts").select("category");
    const counts: Record<string, number> = {};
    (posts ?? []).forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    setCategories((data ?? []).map((c: Category) => ({ ...c, _count: counts[c.slug] || counts[c.name] || 0 })));
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    const slug = slugify(name);
    const { error } = await (supabase as any).from("categories").insert({ name, slug, sort_order: categories.length });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setNewName("");
      fetchCategories();
      toast({ title: "Catégorie ajoutée" });
    }
  };

  const updateCategory = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const slug = slugify(name);
    const { error } = await (supabase as any).from("categories").update({ name, slug }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setEditingId(null);
      fetchCategories();
      toast({ title: "Catégorie modifiée" });
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await (supabase as any).from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      fetchCategories();
      toast({ title: "Catégorie supprimée" });
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">🏷️ Catégories</h1>

      {/* Add form */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Nouvelle catégorie..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          className="max-w-xs"
        />
        <Button onClick={addCategory} className="honey-gradient text-primary-foreground gap-1.5">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Articles</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>
                  ))
                : categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </td>
                      <td className="px-4 py-3">
                        {editingId === cat.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && updateCategory(cat.id)}
                            onBlur={() => updateCategory(cat.id)}
                            autoFocus
                            className="h-8 max-w-[200px]"
                          />
                        ) : (
                          <span className="font-medium text-foreground">{cat.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{cat._count || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} aria-label="Modifier">
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteCategory(cat.id)} aria-label="Supprimer">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && categories.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-3xl mb-2">🏷️</p>
            <p>Aucune catégorie. Ajoutez-en une ci-dessus.</p>
          </div>
        )}
      </div>
    </div>
  );
}
