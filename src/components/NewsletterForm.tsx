import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  title?: string;
  subtitle?: string;
  variant?: "card" | "inline" | "hero";
}

export default function NewsletterForm({
  title = "Inscrivez-vous à la newsletter",
  subtitle = "Recevez nos meilleurs articles directement dans votre boîte mail.",
  variant = "card",
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Email invalide", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("subscribers").insert({ email: trimmed });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Vous êtes déjà inscrit(e) 🐝" });
          setSuccess(true);
        } else throw error;
      } else {
        setSuccess(true);
        toast({ title: "Inscription réussie ! 🎉" });
      }
      setEmail("");
    } catch (err: any) {
      toast({ title: "Erreur", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={variant === "card" ? "bg-card rounded-xl border border-border p-6 text-center" : "text-center"}>
        <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="font-heading font-bold text-foreground">Merci pour votre inscription ! 🐝</p>
        <p className="text-sm text-muted-foreground mt-1">Vous recevrez nos prochains articles par email.</p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="bg-background/20 border-background/30 text-background placeholder:text-background/50 backdrop-blur-sm"
        />
        <Button type="submit" disabled={loading} className="honey-gradient text-primary-foreground gap-1.5 whitespace-nowrap">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          S'inscrire
        </Button>
      </form>
    );
  }

  return (
    <div className={variant === "card" ? "bg-card rounded-xl border border-border p-5" : ""}>
      <h3 className="font-heading font-bold text-foreground mb-1 flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" /> {title}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="flex-1"
        />
        <Button type="submit" disabled={loading} size="sm" className="honey-gradient text-primary-foreground gap-1">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
