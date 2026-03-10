import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  title?: string;
  subtitle?: string;
  variant?: "card" | "inline" | "hero";
}

export default function NewsletterForm({
  title,
  subtitle,
  variant = "card",
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const displayTitle = title || t("newsletter_title");
  const displaySubtitle = subtitle || t("newsletter_subtitle");

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
          toast({ title: t("newsletter_already") });
          setSuccess(true);
        } else throw error;
      } else {
        setSuccess(true);
        toast({ title: t("newsletter_success") });
      }
      setEmail("");
    } catch (err: any) {
      toast({ title: t("newsletter_error"), description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={variant === "card" ? "bg-card rounded-xl border border-border p-6 text-center" : "text-center"}>
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="font-heading font-bold text-foreground">{t("newsletter_success")}</p>
        <p className="text-sm text-muted-foreground mt-1">{t("newsletter_subtitle")}</p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter_placeholder")}
          className="flex-1 h-10 rounded-lg border-2 border-primary bg-background text-foreground px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button type="submit" disabled={loading} className="honey-gradient text-primary-foreground gap-1.5 whitespace-nowrap">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {t("newsletter_button")}
        </Button>
      </form>
    );
  }

  return (
    <div className={variant === "card" ? "bg-card rounded-xl border border-border p-5" : ""}>
      <h3 className="font-heading font-bold text-foreground mb-1 flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" /> {displayTitle}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">{displaySubtitle}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter_placeholder")}
          className="flex-1 h-10 rounded-lg border-2 border-primary bg-background text-foreground px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button type="submit" disabled={loading} size="sm" className="honey-gradient text-primary-foreground gap-1">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
