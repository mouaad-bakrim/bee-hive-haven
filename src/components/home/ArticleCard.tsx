import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { Article } from "@/data/articles";
import { categoryLabels, categoryColors } from "@/data/articles";

interface Props {
  article: Article;
  index?: number;
}

export default function ArticleCard({ article, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-card rounded-xl border border-border overflow-hidden card-hover"
    >
      <Link to={`/article/${article.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${categoryColors[article.category]}`}>
            {categoryLabels[article.category]}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading font-bold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min
              </span>
            </div>
            <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Lire →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
