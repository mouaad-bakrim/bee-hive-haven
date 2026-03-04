import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key =
      import.meta.env.VITE_SUPABASE_ANON_KEY ??
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const resolveLoading = () => {
      if (!cancelled) setLoading(false);
    };

    // Safeguard: force loading to resolve after 8s if getSession hangs (e.g. Supabase down)
    const timeoutId = window.setTimeout(resolveLoading, 8000);

    // Only for subsequent auth changes (login/logout in another tab). Do NOT call
    // resolveLoading() here so we don't flash login before getSession() completes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sess) => {
        setSession(sess);
        setUser(sess?.user ?? null);
        if (sess?.user) {
          checkAdmin(sess.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Resolve loading only after initial session is known. Prevents redirect to
    // /login then back to /admin on refresh.
    (async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          checkAdmin(s.user.id);
        } else {
          setIsAdmin(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        resolveLoading();
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
