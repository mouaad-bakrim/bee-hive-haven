import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import HeroBackground from "./HeroBackground";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTranslation } from "@/hooks/useTranslation";
import heroApiary from "@/assets/hero-apiary.jpg";
import heroHoneycomb from "@/assets/hero-honeycomb.jpg";
import heroBeekeeper from "@/assets/hero-beekeeper.jpg";
import heroLavender from "@/assets/hero-lavender.jpg";

const DEFAULT_SLIDES = [heroApiary, heroHoneycomb, heroBeekeeper, heroLavender];
const SLIDE_DURATION = 6000;

const FLOATING_ICONS = [
  { emoji: "🐝", x: "10%", y: "20%", size: 32, dur: 6 },
  { emoji: "🍯", x: "80%", y: "15%", size: 28, dur: 8 },
  { emoji: "🌼", x: "70%", y: "70%", size: 26, dur: 7 },
  { emoji: "🐝", x: "20%", y: "75%", size: 30, dur: 9 },
  { emoji: "🌸", x: "50%", y: "10%", size: 24, dur: 7.5 },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.16a8.16 8.16 0 004.76 1.53v-3.5a4.82 4.82 0 01-1-.5z" />
    </svg>
  );
}

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: settings } = useSiteSettings();
  const { t } = useTranslation();

  const heroTitle = settings?.hero_title || t("hero_title");
  const heroSubtitle = settings?.hero_subtitle || t("hero_subtitle");
  const ctaText = settings?.hero_cta_text || t("hero_cta");
  const showBeeAnimations = settings?.show_bee_animations !== false;

  const slides = DEFAULT_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleMouse = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setMouse({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttled = (e: MouseEvent) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { handleMouse(e); ticking = false; });
      }
    };
    window.addEventListener("mousemove", throttled);
    return () => window.removeEventListener("mousemove", throttled);
  }, [handleMouse]);

  const socialLinks = [
    { url: settings?.instagram_url, enabled: settings?.instagram_enabled, icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
    { url: settings?.facebook_url, enabled: settings?.facebook_enabled, icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
    { url: settings?.youtube_url, enabled: settings?.youtube_enabled, icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
    { url: settings?.tiktok_url, enabled: settings?.tiktok_enabled, icon: <TikTokIcon className="w-5 h-5" />, label: "TikTok" },
    { url: settings?.twitter_url, enabled: settings?.twitter_enabled, icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
  ].filter((s) => s.enabled !== false && s.url);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={slides[currentSlide]}
          alt="Rucher au coucher du soleil"
          className="absolute inset-0 w-full h-full object-cover"
          loading={currentSlide === 0 ? "eager" : "lazy"}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ x: mouse.x * -15, y: mouse.y * -10 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 hero-overlay z-[5]" />
      <HeroBackground />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-primary w-8" : "bg-background/40 hover:bg-background/60"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {showBeeAnimations && FLOATING_ICONS.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute z-[15] pointer-events-none select-none"
          style={{ left: icon.x, top: icon.y, fontSize: icon.size, filter: "blur(0.5px)", x: mouse.x * (10 + i * 5), y: mouse.y * (8 + i * 4) }}
          animate={{ y: [0, -18, 0, 12, 0], x: [0, 10, -8, 5, 0], rotate: [0, 5, -5, 3, 0] }}
          transition={{ duration: icon.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon.emoji}
        </motion.span>
      ))}

      <div className="relative z-20 container mx-auto px-4 text-center text-background">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ x: mouse.x * 8, y: mouse.y * 5 }}
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-background/85 leading-relaxed mb-8"
          style={{ x: mouse.x * 5, y: mouse.y * 3 }}
        >
          {heroSubtitle.split("\n").map((line, i) => (
            <span key={i}>{line}{i < heroSubtitle.split("\n").length - 1 && <br />}</span>
          ))}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/#articles"
            onClick={() => {
              setTimeout(() => { document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" }); }, 100);
            }}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base shadow-lg transition-all hover:scale-105"
          >
            <span className="relative">🍯 {ctaText}</span>
          </Link>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-11 h-11 rounded-full bg-background/15 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary hover:text-primary-foreground transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
