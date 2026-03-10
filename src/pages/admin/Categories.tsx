import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { categoriesQueryKey } from "@/hooks/useCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: categoriesQueryKey });

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const { data: posts } = await supabase.from("posts").select("category");
    const counts: Record<string, number> = {};
    (posts ?? []).forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    setCategories((data ?? []).map((c) => ({ ...c, _count: counts[c.slug] || counts[c.name] || 0 })));
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    const slug = slugify(name);
    const { error } = await supabase.from("categories").insert({ name, slug, sort_order: categories.length });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setNewName("");
      fetchCategories();
      invalidate();
      toast({ title: "Catégorie ajoutée ✅" });
    }
  };

  const updateCategory = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const slug = slugify(name);
    const { error } = await supabase.from("categories").update({ name, slug }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setEditingId(null);
      fetchCategories();
      invalidate();
      toast({ title: "Catégorie modifiée ✅" });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      fetchCategories();
      invalidate();
      toast({ title: "Catégorie supprimée ✅" });
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">🏷️ Catégories</h1>

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
                          <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(cat)} aria-label="Supprimer">
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (deleteTarget._count ?? 0) > 0 ? (
                <span className="flex items-start gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  Cette catégorie contient {deleteTarget._count} article{(deleteTarget._count ?? 0) > 1 ? "s" : ""}. La suppression ne supprimera pas les articles mais ils n'auront plus de catégorie valide.
                </span>
              ) : (
                "Cette action est irréversible."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
