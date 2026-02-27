import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import HeroBackground from "./HeroBackground";
import heroImage from "@/assets/hero-apiary.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Rucher au coucher du soleil"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 hero-overlay z-[5]" />

      {/* Animated particles */}
      <HeroBackground />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-background">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
        >
          Bienvenue au Coin des Apiculteurs 🐝
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-background/85 leading-relaxed mb-8"
        >
          Ici, on parle ruches, miel et passion ❤️<br />
          Partagez vos expériences, posez vos questions,<br />
          et faisons grandir nos colonies ensemble 🍯
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/#articles"
            onClick={() => {
              setTimeout(() => {
                document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full honey-gradient text-primary-foreground font-bold text-base shadow-lg hover:opacity-90 transition-all hover:scale-105"
          >
            🍯 Découvrir les articles
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
