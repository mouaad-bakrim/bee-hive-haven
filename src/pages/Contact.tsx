import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Le message doit faire au moins 10 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-24 text-center max-w-lg">
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Message envoyé !</h1>
        <p className="text-muted-foreground">Merci pour votre message. Nous vous répondrons dans les meilleurs délais. 🐝</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">📬 Nous contacter</h1>
      <p className="text-muted-foreground mb-8">Une question, une suggestion ? Écrivez-nous !</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nom</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Votre nom"
          />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="votre@email.com"
          />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Votre message…"
          />
          {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg honey-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" /> Envoyer
        </button>
      </form>
    </motion.div>
  );
}
