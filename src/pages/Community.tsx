import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { useTranslation } from "@/hooks/useTranslation";

interface Question {
  id: string;
  title: string;
  content: string;
  author_name: string;
  slug: string;
  created_at: string;
  answers?: Answer[];
}

interface Answer {
  id: string;
  content: string;
  author_name: string;
  votes_up: number;
  votes_down: number;
  created_at: string;
}

type SortMode = "recent" | "votes" | "unanswered";

function slugify(text: string) {
  return text.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    .replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
}

export default function Community() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [answerAuthor, setAnswerAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchAll = async () => {
    setLoading(true);
    const { data: qs } = await supabase
      .from("forum_questions")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (qs && qs.length > 0) {
      const { data: ans } = await supabase
        .from("forum_answers")
        .select("*")
        .in("question_id", qs.map((q) => q.id))
        .order("votes_up", { ascending: false });
      const grouped = (qs as Question[]).map((q) => ({
        ...q,
        answers: ((ans ?? []) as Answer[]).filter((a: any) => a.question_id === q.id),
      }));
      setQuestions(grouped);
    } else {
      setQuestions([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const sorted = [...questions].sort((a, b) => {
    if (sortMode === "votes") {
      const aVotes = (a.answers ?? []).reduce((s, ans) => s + ans.votes_up, 0);
      const bVotes = (b.answers ?? []).reduce((s, ans) => s + ans.votes_up, 0);
      return bVotes - aVotes;
    }
    if (sortMode === "unanswered") {
      return (a.answers?.length ?? 0) - (b.answers?.length ?? 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthor.trim()) {
      toast({ title: t("fill_all_fields"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("forum_questions").insert({
        title: newTitle.trim(),
        content: newContent.trim(),
        author_name: newAuthor.trim(),
        slug: slugify(newTitle),
      });
      if (error) throw error;
      toast({ title: t("question_sent"), description: t("pending_moderation") });
      setNewTitle(""); setNewContent(""); setNewAuthor(""); setShowForm(false);
      fetchAll();
    } catch (err: any) {
      toast({ title: t("error"), description: err?.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!answerContent.trim() || !answerAuthor.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("forum_answers").insert({
        question_id: questionId,
        content: answerContent.trim(),
        author_name: answerAuthor.trim(),
      });
      if (error) throw error;
      toast({ title: t("answer_sent") });
      setAnswerContent(""); setAnswerAuthor(""); setSelectedQ(null);
      fetchAll();
    } catch (err: any) {
      toast({ title: t("error"), description: err?.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (answerId: string, direction: "up" | "down") => {
    await supabase.rpc("vote_answer", { p_answer_id: answerId, p_direction: direction });
    fetchAll();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">🐝 {t("community_title")}</h1>
            <p className="text-muted-foreground mt-1">{t("community_subtitle")}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="honey-gradient text-primary-foreground gap-1.5">
            <Plus className="w-4 h-4" /> {t("ask_question")}
          </Button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAskQuestion}
            className="bg-card rounded-xl border border-border p-6 mb-8 space-y-4"
          >
            <Input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder={t("your_name")} maxLength={100} />
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t("question_title")} maxLength={200} />
            <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder={t("question_detail")} rows={4} maxLength={2000} />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="honey-gradient text-primary-foreground gap-1.5">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t("publish")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t("cancel")}</Button>
            </div>
          </motion.form>
        )}

        {/* Sort tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "recent" as SortMode, label: t("sort_recent") },
            { key: "votes" as SortMode, label: t("sort_votes") },
            { key: "unanswered" as SortMode, label: t("sort_unanswered") },
          ]).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortMode(s.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortMode === s.key ? "honey-gradient text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : sorted.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
            <p className="text-4xl mb-3">🐝</p>
            <p className="font-heading font-bold text-foreground mb-2">{t("no_questions")}</p>
            <p className="text-sm">{t("be_first")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sorted.map((q) => (
              <div key={q.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-5">
                  <h2 className="font-heading font-bold text-lg text-foreground mb-1">{q.title}</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Par <span className="font-medium text-foreground">{q.author_name}</span> · {formatTimeAgo(q.created_at)}
                  </p>
                  <p className="text-foreground whitespace-pre-wrap">{q.content}</p>
                </div>

                {(q.answers ?? []).length > 0 && (
                  <div className="border-t border-border divide-y divide-border">
                    {(q.answers ?? []).map((a) => (
                      <div key={a.id} className="p-4 pl-8 bg-secondary/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span className="font-medium text-foreground">{a.author_name}</span>
                          <span>·</span>
                          <span>{formatTimeAgo(a.created_at)}</span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap mb-2">{a.content}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleVote(a.id, "up")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" /> {a.votes_up}
                          </button>
                          <button onClick={() => handleVote(a.id, "down")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                            <ThumbsDown className="w-3.5 h-3.5" /> {a.votes_down}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 border-t border-border">
                  {selectedQ === q.id ? (
                    <div className="space-y-3">
                      <Input value={answerAuthor} onChange={(e) => setAnswerAuthor(e.target.value)} placeholder={t("your_name")} maxLength={100} />
                      <Textarea value={answerContent} onChange={(e) => setAnswerContent(e.target.value)} placeholder={t("your_answer")} rows={3} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAnswer(q.id)} disabled={submitting} className="honey-gradient text-primary-foreground gap-1">
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {t("answer")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedQ(null)}>{t("cancel")}</Button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedQ(q.id)} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> {t("answer")} ({(q.answers ?? []).length})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
