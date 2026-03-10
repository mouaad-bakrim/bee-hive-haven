import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    .trim()
    .replace(/[àâä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(^-|-$)/g, "");
}

async function fetchCategoriesWithCounts(): Promise<Category[]> {
  const [{ data: cats, error }, { data: posts }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("posts").select("category"),
  ]);
  if (error) throw error;
  const counts: Record<string, number> = {};
  (posts ?? []).forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return (cats ?? []).map((c) => ({
    ...c,
    _count: counts[c.slug] || counts[c.name] || 0,
  }));
}

export default function Categories() {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategoriesWithCounts,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
  };

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = slugify(name);
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, slug, sort_order: categories.length })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewName("");
      invalidateAll();
      toast({ title: "Catégorie ajoutée ✅" });
    },
    onError: (err: any) => {
      toast({ title: "Erreur lors de l'ajout", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const slug = slugify(name);
      const { error } = await supabase.from("categories").update({ name, slug }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditingId(null);
      invalidateAll();
      toast({ title: "Catégorie modifiée ✅" });
    },
    onError: (err: any) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setDeleteTarget(null);
      invalidateAll();
      toast({ title: "Catégorie supprimée ✅" });
    },
    onError: (err: any) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addMutation.mutate(name);
  };

  const handleUpdate = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    updateMutation.mutate({ id, name });
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">🏷️ Catégories</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Nouvelle catégorie..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="max-w-xs"
        />
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          disabled={addMutation.isPending || !newName.trim()}
          className={
            !newName.trim()
              ? "bg-muted text-muted-foreground cursor-not-allowed gap-1.5"
              : "honey-gradient text-primary-foreground gap-1.5"
          }
        >
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
                    <tr key={i}>
                      <td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ))
                : categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </td>
                      <td className="px-4 py-3">
                        {editingId === cat.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdate(cat.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              autoFocus
                              className="h-8 max-w-[200px]"
                            />
                            <Button size="icon" variant="ghost" onClick={() => handleUpdate(cat.id)} disabled={updateMutation.isPending}>
                              <Check className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium text-foreground">{cat.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{cat._count || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                            aria-label="Modifier"
                          >
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteTarget(cat)}
                            aria-label="Supprimer"
                          >
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
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
