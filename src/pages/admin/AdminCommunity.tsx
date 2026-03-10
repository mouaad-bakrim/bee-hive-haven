import { useState } from "react";
import { Loader2, Trash2, Check, X, Star, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatTimeAgo } from "@/lib/formatTimeAgo";

type TabStatus = "all" | "pending" | "published" | "rejected";

export default function AdminCommunity() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["admin-community-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: answers = [] } = useQuery({
    queryKey: ["admin-community-answers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("forum_answers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("forum_questions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-community-questions"] });
      toast({ title: "Statut mis à jour ✅" });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("forum_questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-community-questions"] });
      qc.invalidateQueries({ queryKey: ["admin-community-answers"] });
      toast({ title: "Question supprimée ✅" });
    },
  });

  const deleteAnswer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("forum_answers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-community-answers"] });
      toast({ title: "Réponse supprimée ✅" });
    },
  });

  const filtered = tab === "all" ? questions : questions.filter((q) => q.status === (tab === "pending" ? "pending" : tab));
  const pendingCount = questions.filter((q) => q.status === "pending").length;
  const publishedCount = questions.filter((q) => q.status === "published").length;
  const rejectedCount = questions.filter((q) => q.status === "rejected").length;

  const getAnswersForQuestion = (qId: string) => answers.filter((a) => a.question_id === qId);

  const statusBadge = (status: string) => {
    if (status === "pending") return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">En attente</span>;
    if (status === "published") return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Approuvée</span>;
    if (status === "rejected") return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Rejetée</span>;
    return null;
  };

  const tabs: { key: TabStatus; label: string; count: number }[] = [
    { key: "all", label: "Tous", count: questions.length },
    { key: "pending", label: "En attente", count: pendingCount },
    { key: "published", label: "Approuvées", count: publishedCount },
    { key: "rejected", label: "Rejetées", count: rejectedCount },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-2">🐝 Communauté</h1>
      <p className="text-sm text-muted-foreground mb-6">Gestion des questions et réponses du forum</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total questions", value: questions.length, icon: <MessageSquare className="w-5 h-5" /> },
          { label: "En attente", value: pendingCount, icon: <Clock className="w-5 h-5 text-amber-500" /> },
          { label: "Approuvées", value: publishedCount, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
          { label: "Total réponses", value: answers.length, icon: <Star className="w-5 h-5 text-primary" /> },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t.key ? "honey-gradient text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          <p className="text-4xl mb-3">🐝</p>
          <p className="font-heading font-bold text-foreground mb-1">Aucune question</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const qAnswers = getAnswersForQuestion(q.id);
            const isExpanded = expanded === q.id;
            return (
              <div key={q.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 flex items-start justify-between gap-3">
                  <button onClick={() => setExpanded(isExpanded ? null : q.id)} className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(q.status)}
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(q.created_at)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {qAnswers.length} réponse{qAnswers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-foreground">{q.title}</h3>
                    <p className="text-sm text-muted-foreground">Par {q.author_name}</p>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    {q.status !== "published" && (
                      <Button size="icon" variant="ghost" onClick={() => updateStatus.mutate({ id: q.id, status: "published" })} title="Approuver">
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    {q.status !== "rejected" && (
                      <Button size="icon" variant="ghost" onClick={() => updateStatus.mutate({ id: q.id, status: "rejected" })} title="Rejeter">
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette question ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible. Les réponses associées seront également supprimées.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteQuestion.mutate(q.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border">
                    <div className="p-4 bg-secondary/20">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{q.content}</p>
                    </div>
                    {qAnswers.length > 0 && (
                      <div className="divide-y divide-border">
                        {qAnswers.map((a) => (
                          <div key={a.id} className="p-4 pl-8 flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <span className="font-medium text-foreground">{a.author_name}</span>
                                <span>·</span>
                                <span>{formatTimeAgo(a.created_at)}</span>
                                <span className="text-xs">👍 {a.votes_up} 👎 {a.votes_down}</span>
                              </div>
                              <p className="text-sm text-foreground whitespace-pre-wrap">{a.content}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => deleteAnswer.mutate(a.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
