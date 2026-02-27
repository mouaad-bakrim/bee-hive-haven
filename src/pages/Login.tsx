import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const { user, isAdmin, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast({ title: isSignUp ? "Erreur d'inscription" : "Erreur de connexion", description: error, variant: "destructive" });
    } else if (isSignUp) {
      toast({ title: "Compte créé", description: "Vérifiez votre email pour confirmer votre compte." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <span className="text-4xl">🐝</span>
            <h1 className="font-heading text-2xl font-bold mt-3 text-foreground">
              Administration
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full honey-gradient text-primary-foreground" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
              {isSignUp ? "Créer le compte" : "Se connecter"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>

          {user && !isAdmin && (
            <p className="mt-4 text-center text-sm text-destructive">
              Ce compte n'a pas les droits d'administration.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
