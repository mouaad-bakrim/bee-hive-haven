import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  status: string;
  created_at: string;
}

const FILTERS = [
  { label: "Tous", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "Approuvés", value: "approved" },
  { label: "Spam", value: "spam" },
];

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const fetchComments = async () => {
    setLoading(true);
    let query = (supabase as any).from("comments").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data, error } = await query;
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setComments(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any).from("comments").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "Commentaire approuvé" : "Marqué comme spam" });
      fetchComments();
    }
  };

  const deleteComment = async (id: string) => {
    const { error } = await (supabase as any).from("comments").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Commentaire supprimé" });
      fetchComments();
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">💬 Commentaires</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f.value
                ? "honey-gradient text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Auteur</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Commentaire</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>
                  ))
                : comments.map((c) => (
                    <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{c.author_name}</p>
                        <p className="text-xs text-muted-foreground">{c.author_email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground max-w-xs truncate">{c.content}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          c.status === "approved" ? "bg-accent/10 text-accent"
                            : c.status === "spam" ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {c.status === "approved" ? "Approuvé" : c.status === "spam" ? "Spam" : "En attente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {c.status !== "approved" && (
                            <Button size="icon" variant="ghost" onClick={() => updateStatus(c.id, "approved")} aria-label="Approuver">
                              <CheckCircle className="w-4 h-4 text-accent" />
                            </Button>
                          )}
                          {c.status !== "spam" && (
                            <Button size="icon" variant="ghost" onClick={() => updateStatus(c.id, "spam")} aria-label="Spam">
                              <XCircle className="w-4 h-4 text-primary" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" onClick={() => deleteComment(c.id)} aria-label="Supprimer">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && comments.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-3xl mb-2">💬</p>
            <p>Aucun commentaire {filter !== "all" ? `avec le statut "${filter}"` : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}
