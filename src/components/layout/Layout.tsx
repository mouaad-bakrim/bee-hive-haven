import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full honey-gradient text-primary-foreground shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const THEME_COLORS: Record<string, string> = {
  amber: "38 92% 50%",
  green: "142 71% 45%",
  blue: "217 91% 60%",
  dark: "220 9% 46%",
};

const RADIUS_MAP: Record<string, string> = {
  none: "0",
  rounded: "0.5rem",
  full: "1rem",
};

const SPEED_MAP: Record<string, string> = {
  fast: "0.15s",
  normal: "0.3s",
  slow: "0.6s",
  none: "0s",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: settings } = useSiteSettings();
  const showChatbot = settings?.show_chatbot !== false;

  useEffect(() => {
    if (settings?.site_name) {
      document.title = settings.site_name;
    }
  }, [settings?.site_name]);

  // Apply theme settings as CSS variables
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;

    // Color palette
    const preset = settings.theme_preset ?? "amber";
    if (THEME_COLORS[preset]) {
      root.style.setProperty("--primary", THEME_COLORS[preset]);
    }

    // Font family
    const font = settings.font_family ?? "sans";
    root.style.setProperty(
      "--font-heading",
      font === "serif" ? "'Georgia', 'Times New Roman', serif" : "'Inter', system-ui, sans-serif"
    );

    // Border radius
    const radius = settings.border_radius_preset ?? "rounded";
    if (RADIUS_MAP[radius]) {
      root.style.setProperty("--radius", RADIUS_MAP[radius]);
    }

    // Animation speed
    const speed = settings.animation_speed ?? "normal";
    if (SPEED_MAP[speed]) {
      root.style.setProperty("--animation-speed", SPEED_MAP[speed]);
    }

    // Card style
    const cardStyle = settings.card_style ?? "shadow";
    root.dataset.cardStyle = cardStyle;
  }, [settings]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1 pt-16">{children}</main>
      <Footer />
      <BackToTop />
      {showChatbot && <ChatbotWidget />}
    </div>
  );
}
