import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  letter: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Seed data for initial display
const SEED_TERMS: Omit<GlossaryTerm, "id">[] = [
  { term: "Abeille", definition: "Insecte hyménoptère social vivant en colonie, producteur de miel et acteur essentiel de la pollinisation.", letter: "A" },
  { term: "Apiculture", definition: "Élevage des abeilles pour la production de miel, cire, pollen et autres produits de la ruche.", letter: "A" },
  { term: "Cadre", definition: "Structure en bois ou plastique insérée dans la ruche sur laquelle les abeilles construisent les rayons de cire.", letter: "C" },
  { term: "Cire", definition: "Substance produite par les glandes cirières des abeilles ouvrières, utilisée pour construire les rayons.", letter: "C" },
  { term: "Colonie", definition: "Ensemble organisé d'abeilles vivant dans une même ruche : une reine, des ouvrières et des faux-bourdons.", letter: "C" },
  { term: "Essaimage", definition: "Phénomène naturel de reproduction de la colonie : la reine part avec une partie des abeilles pour fonder une nouvelle colonie.", letter: "E" },
  { term: "Enfumoir", definition: "Outil de l'apiculteur produisant de la fumée pour calmer les abeilles lors des inspections.", letter: "E" },
  { term: "Faux-bourdon", definition: "Abeille mâle dont le seul rôle est la fécondation de la reine.", letter: "F" },
  { term: "Hausse", definition: "Élément supérieur de la ruche où les abeilles stockent le miel destiné à la récolte.", letter: "H" },
  { term: "Hivernage", definition: "Période hivernale durant laquelle la colonie réduit son activité et vit sur ses réserves de miel.", letter: "H" },
  { term: "Miel", definition: "Substance sucrée produite par les abeilles à partir du nectar des fleurs ou du miellat.", letter: "M" },
  { term: "Nourrissement", definition: "Apport de sirop de sucre ou de candi aux abeilles pour compenser un manque de réserves.", letter: "N" },
  { term: "Opercule", definition: "Fine pellicule de cire avec laquelle les abeilles ferment les alvéoles contenant le miel mûr ou le couvain.", letter: "O" },
  { term: "Pollen", definition: "Poudre fine produite par les fleurs, récoltée par les abeilles comme source de protéines.", letter: "P" },
  { term: "Propolis", definition: "Résine végétale récoltée et transformée par les abeilles pour désinfecter et colmater la ruche.", letter: "P" },
  { term: "Reine", definition: "Seule femelle fertile de la colonie, responsable de la ponte des œufs.", letter: "R" },
  { term: "Ruche", definition: "Habitat artificiel conçu pour abriter une colonie d'abeilles.", letter: "R" },
  { term: "Rucher", definition: "Ensemble de ruches installées en un même lieu.", letter: "R" },
  { term: "Varroa", definition: "Acarien parasite (Varroa destructor) s'attaquant aux abeilles et aux larves, principale menace sanitaire en apiculture.", letter: "V" },
];

export default function Glossary() {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const { data: dbTerms = [], isLoading } = useQuery({
    queryKey: ["glossary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("glossary_terms")
        .select("*")
        .order("term", { ascending: true });
      if (error) throw error;
      return (data ?? []) as GlossaryTerm[];
    },
  });

  // Use DB terms if available, otherwise show seed data
  const terms = dbTerms.length > 0 ? dbTerms : SEED_TERMS.map((t, i) => ({ ...t, id: `seed-${i}` }));

  const filtered = useMemo(
    () => activeLetter ? terms.filter((t) => t.letter.toUpperCase() === activeLetter) : terms,
    [terms, activeLetter]
  );

  const availableLetters = useMemo(
    () => new Set(terms.map((t) => t.letter.toUpperCase())),
    [terms]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            <BookOpen className="w-8 h-8 inline-block mr-2 text-primary" />
            Glossaire Apicole
          </h1>
          <p className="text-muted-foreground">Les termes essentiels de l'apiculture expliqués simplement.</p>
        </div>

        {/* Alphabet filter */}
        <div className="flex flex-wrap justify-center gap-1 mb-8">
          <button
            onClick={() => setActiveLetter(null)}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
              !activeLetter ? "honey-gradient text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            Tous
          </button>
          {ALPHABET.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLetter(l === activeLetter ? null : l)}
              disabled={!availableLetters.has(l)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                activeLetter === l
                  ? "honey-gradient text-primary-foreground"
                  : availableLetters.has(l)
                  ? "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  : "bg-muted text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-4">
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-lg shrink-0">
                    {t.letter}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{t.term}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.definition}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-4xl mb-3">🐝</p>
                <p>Aucun terme pour cette lettre.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
