import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import HeroBackground from "./HeroBackground";
import heroApiary from "@/assets/hero-apiary.jpg";
import heroHoneycomb from "@/assets/hero-honeycomb.jpg";
import heroBeekeeper from "@/assets/hero-beekeeper.jpg";
import heroLavender from "@/assets/hero-lavender.jpg";

const SLIDES = [heroApiary, heroHoneycomb, heroBeekeeper, heroLavender];
const SLIDE_DURATION = 6000;

const FLOATING_ICONS = [
  { emoji: "🐝", x: "10%", y: "20%", size: 32, dur: 6 },
  { emoji: "🍯", x: "80%", y: "15%", size: 28, dur: 8 },
  { emoji: "🌼", x: "70%", y: "70%", size: 26, dur: 7 },
  { emoji: "🐝", x: "20%", y: "75%", size: 30, dur: 9 },
  { emoji: "🌸", x: "50%", y: "10%", size: 24, dur: 7.5 },
];

export default function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

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
        requestAnimationFrame(() => {
          handleMouse(e);
          ticking = false;
        });
      }
    };
    window.addEventListener("mousemove", throttled);
    return () => window.removeEventListener("mousemove", throttled);
  }, [handleMouse]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Slider images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={SLIDES[currentSlide]}
          alt="Rucher au coucher du soleil"
          className="absolute inset-0 w-full h-full object-cover"
          loading={currentSlide === 0 ? "eager" : "lazy"}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            x: mouse.x * -15,
            y: mouse.y * -10,
          }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 hero-overlay z-[5]" />

      {/* Canvas particles */}
      <HeroBackground />

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-primary w-8"
                : "bg-background/40 hover:bg-background/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Floating icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute z-[15] pointer-events-none select-none"
          style={{
            left: icon.x,
            top: icon.y,
            fontSize: icon.size,
            filter: "blur(0.5px)",
            x: mouse.x * (10 + i * 5),
            y: mouse.y * (8 + i * 4),
          }}
          animate={{
            y: [0, -18, 0, 12, 0],
            x: [0, 10, -8, 5, 0],
            rotate: [0, 5, -5, 3, 0],
          }}
          transition={{
            duration: icon.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon.emoji}
        </motion.span>
      ))}

      {/* Content with stagger */}
      <div className="relative z-20 container mx-auto px-4 text-center text-background">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ x: mouse.x * 8, y: mouse.y * 5 }}
        >
          Bienvenue au Coin des Apiculteurs 🐝
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-background/85 leading-relaxed mb-8"
          style={{ x: mouse.x * 5, y: mouse.y * 3 }}
        >
          Ici, on parle ruches, miel et passion ❤️<br />
          Partagez vos expériences, posez vos questions,<br />
          et faisons grandir nos colonies ensemble 🍯
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
              setTimeout(() => {
                document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full honey-gradient text-primary-foreground font-bold text-base shadow-lg transition-all hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "0 0 25px 5px hsl(37 91% 55% / 0.5)" }} />
            <span className="relative">🍯 Découvrir les articles</span>
          </Link>

          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-background/15 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary hover:text-primary-foreground transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-background/15 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary hover:text-primary-foreground transition-all">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
