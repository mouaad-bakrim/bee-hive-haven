export type Category = 'actualite' | 'sante' | 'cours' | 'histoires' | 'buzz';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  tags: string[];
  coverImage: string;
  author: string;
  date: string;
  readTime: number;
  featured: boolean;
  views: number;
}

export const categoryLabels: Record<Category, string> = {
  actualite: "Actualité",
  sante: "Santé",
  cours: "Cours Gratuit",
  histoires: "Histoires",
  buzz: "Buzz",
};

export const categoryColors: Record<Category, string> = {
  actualite: "bg-cat-actualite",
  sante: "bg-cat-sante",
  cours: "bg-cat-cours",
  histoires: "bg-cat-histoires",
  buzz: "bg-cat-buzz",
};

export const categoryTextColors: Record<Category, string> = {
  actualite: "text-cat-actualite",
  sante: "text-cat-sante",
  cours: "text-cat-cours",
  histoires: "text-cat-histoires",
  buzz: "text-cat-buzz",
};

export const articles: Article[] = [
  {
    id: "1",
    slug: "7-causes-pertes-hivernales-colonies-abeilles",
    title: "🐝 Les 7 causes des pertes hivernales des colonies d'abeilles",
    excerpt: "Découvrez pourquoi vos colonies ne survivent pas à l'hiver et comment y remédier efficacement.",
    category: "actualite",
    tags: ["hiver", "colonies", "varroa", "ruches", "mortalité"],
    coverImage: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-12-15",
    readTime: 8,
    featured: true,
    views: 3420,
    content: `
      <h2>🍯 1. Manque de réserves alimentaires</h2>
      <p>La première cause de mortalité hivernale est le manque de nourriture. Une colonie a besoin d'environ 15 à 20 kg de miel pour passer l'hiver sereinement. Si les réserves sont insuffisantes, les abeilles meurent de faim avant le retour des beaux jours.</p>
      <div class="conseil"><p>💡 Conseil : Pesez vos ruches à l'automne. Si elles font moins de 30 kg au total, complétez avec du sirop lourd (2 parts de sucre pour 1 part d'eau).</p></div>

      <h2>🔬 2. Le Varroa destructor</h2>
      <p>Ce parasite est l'ennemi numéro un de l'apiculteur. Le varroa affaiblit les abeilles en se nourrissant de leur corps gras et transmet de nombreux virus. Sans traitement, une colonie infestée est condamnée.</p>
      <div class="did-you-know">
        <span class="dyk-icon">🐝</span>
        <div>
          <strong>Le saviez-vous ?</strong>
          <p>Un varroa peut réduire l'espérance de vie d'une abeille d'hiver de 50%. Traiter en août, c'est sauver les abeilles qui passeront l'hiver !</p>
        </div>
      </div>

      <h2>💧 3. Problèmes d'humidité</h2>
      <p>L'humidité excessive dans la ruche est un tueur silencieux. Elle favorise les moisissures et refroidit les abeilles. Une bonne ventilation et une inclinaison légère de la ruche vers l'avant sont essentielles.</p>

      <h2>👑 4. Reine faible ou absente</h2>
      <p>Une reine âgée ou de mauvaise qualité produit moins de phéromones, ce qui désorganise la grappe hivernale. Vérifiez la qualité de ponte en fin de saison.</p>

      <h2>📦 5. Colonie trop petite</h2>
      <p>Les petites colonies n'ont pas assez d'abeilles pour maintenir la température du couvain. Réunissez les colonies faibles avant l'hiver pour augmenter leurs chances de survie.</p>

      <h2>🦡 6. Prédateurs</h2>
      <p>Pics verts, souris, frelons asiatiques… Les prédateurs fragilisent les colonies déjà affaiblies. Protégez vos ruches avec des portières d'hiver et des pièges adaptés.</p>

      <h2>🌬️ 7. Mauvaise ventilation</h2>
      <p>Un excès de confinement empêche l'évacuation de l'humidité. Gardez une petite ouverture haute pour la ventilation sans créer de courant d'air froid direct.</p>

      <h2>✅ Checklist de préparation hivernale</h2>
      <ul class="checklist">
        <li>Traiter contre le varroa dès fin août</li>
        <li>Vérifier les réserves alimentaires</li>
        <li>Réduire les entrées de la ruche</li>
        <li>Incliner légèrement la ruche vers l'avant</li>
        <li>Réunir les colonies trop faibles</li>
        <li>Protéger contre les prédateurs</li>
      </ul>

      <p><em>Et vous, quelles sont vos astuces pour préparer l'hivernage ? Partagez vos expériences en commentaires ! 🐝</em></p>
    `,
  },
  {
    id: "2",
    slug: "apiculture-sante-bienfaits-abeilles",
    title: "🍯 Apiculture et Santé : Les Bienfaits des Abeilles pour votre Corps",
    excerpt: "Miel, gelée royale, propolis… Découvrez les trésors de la ruche pour votre bien-être.",
    category: "sante",
    tags: ["miel", "propolis", "gelée royale", "pollen", "apithérapie", "santé"],
    coverImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-11-28",
    readTime: 10,
    featured: true,
    views: 5680,
    content: `
      <h2>🍯 1. Le Miel — L'or liquide</h2>
      <p>Le miel est bien plus qu'un simple édulcorant naturel. Riche en antioxydants, en enzymes et en minéraux, il est utilisé depuis des millénaires pour ses vertus thérapeutiques.</p>
      <div class="conseil"><p>💡 Astuce : Une cuillère de miel de thym dans une tisane avant le coucher aide à apaiser les maux de gorge et favorise un sommeil réparateur.</p></div>

      <h2>👑 2. La Gelée Royale — L'élixir de la reine</h2>
      <p>Nourriture exclusive de la reine des abeilles, la gelée royale est un concentré de vitalité. Elle contient des vitamines B, des acides aminés essentiels et des lipides uniques.</p>
      <p>Cure recommandée : 300 à 500 mg par jour pendant 4 à 6 semaines, de préférence le matin à jeun.</p>

      <h2>🌿 3. Le Pollen — Le super-aliment méconnu</h2>
      <p>Le pollen d'abeille est une source exceptionnelle de protéines végétales, de vitamines et de minéraux. Il renforce le système immunitaire et combat la fatigue.</p>
      <div class="did-you-know">
        <span class="dyk-icon">🐝</span>
        <div>
          <strong>Le saviez-vous ?</strong>
          <p>Le pollen contient plus de protéines que la viande, à poids égal ! C'est l'aliment le plus complet de la nature.</p>
        </div>
      </div>

      <h2>🛡️ 4. La Propolis — Le bouclier naturel</h2>
      <p>Les abeilles utilisent la propolis pour désinfecter et protéger la ruche. Ce puissant antibactérien et antiviral naturel est excellent pour renforcer vos défenses immunitaires.</p>

      <h2>💆 5. L'Apithérapie — Se soigner par les abeilles</h2>
      <p>L'apithérapie utilise tous les produits de la ruche à des fins thérapeutiques. Du venin d'abeille pour soulager l'arthrite aux inhalations de l'air de la ruche pour les problèmes respiratoires.</p>

      <div class="medical-warning">
        <p>⚠️ <strong>Avertissement médical :</strong> Les produits de la ruche peuvent provoquer des réactions allergiques. Consultez votre médecin avant toute cure, surtout en cas d'allergie connue aux piqûres d'abeilles. Ne remplacez jamais un traitement médical sans avis professionnel.</p>
      </div>

      <div class="tag-bar">
        <span class="tag-badge">#Miel</span>
        <span class="tag-badge">#Propolis</span>
        <span class="tag-badge">#GeléeRoyale</span>
        <span class="tag-badge">#Pollen</span>
        <span class="tag-badge">#Apithérapie</span>
        <span class="tag-badge">#SantéNaturelle</span>
      </div>
    `,
  },
  {
    id: "3",
    slug: "apiculture-pour-tous-livre-pdf-gratuit",
    title: "📚 Apiculture pour Tous — Livre PDF Gratuit pour Débutants",
    excerpt: "Téléchargez gratuitement notre guide complet pour débuter en apiculture avec confiance.",
    category: "cours",
    tags: ["débutant", "guide", "PDF", "formation", "cours gratuit"],
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-10-05",
    readTime: 5,
    featured: false,
    views: 8920,
    content: `
      <h2>📖 Présentation du guide</h2>
      <p>Vous rêvez de devenir apiculteur mais ne savez pas par où commencer ? Notre guide « Apiculture pour Tous » est fait pour vous ! Rédigé par des apiculteurs passionnés, ce livre PDF gratuit couvre tout ce qu'un débutant doit savoir.</p>

      <h2>✔ Ce que vous allez apprendre</h2>
      <ul class="checklist">
        <li>Les bases de la biologie de l'abeille</li>
        <li>Comment choisir et installer votre première ruche</li>
        <li>Le calendrier apicole mois par mois</li>
        <li>La récolte du miel étape par étape</li>
        <li>Les maladies courantes et comment les prévenir</li>
        <li>Les équipements indispensables du débutant</li>
        <li>Les gestes essentiels pour manipuler vos cadres</li>
      </ul>

      <h2>🎯 À qui s'adresse ce guide ?</h2>
      <p>Ce guide est destiné aux <strong>débutants complets</strong> qui souhaitent se lancer dans l'apiculture de loisir ou semi-professionnelle. Aucune connaissance préalable n'est requise !</p>
      <p>Que vous viviez en campagne ou en ville (apiculture urbaine), ce guide vous accompagnera dans vos premiers pas avec les abeilles. 🐝</p>

      <div class="citation">
        <p>"Ce guide m'a donné la confiance pour installer ma première ruche. Deux ans plus tard, j'ai cinq colonies et je ne regrette rien !"</p>
        <span>— Marie, apicultrice débutante dans le Var</span>
      </div>

      <div class="download-section">
        <h3 style="margin-bottom: 0.5rem;">📥 Téléchargement gratuit</h3>
        <p style="margin-bottom: 1rem; opacity: 0.8;">176 pages • Format PDF • Illustrations couleur</p>
        <p><em>Le fichier sera bientôt disponible au téléchargement. Inscrivez-vous à notre newsletter pour être notifié !</em></p>
      </div>
    `,
  },
  {
    id: "4",
    slug: "histoires-apiculteurs-temoignages-passionnes",
    title: "🐝 Histoires d'Apiculteurs — Témoignages de Passionnés",
    excerpt: "Trois récits inspirants de personnes qui ont trouvé leur voie grâce aux abeilles.",
    category: "histoires",
    tags: ["témoignage", "passion", "reconversion", "débutant", "retraite"],
    coverImage: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-09-18",
    readTime: 12,
    featured: true,
    views: 4150,
    content: `
      <div class="story-box">
        <div class="story-header">
          <span class="story-badge">🍯</span>
          <h3>Histoire #1 • Sophie — La reconversion</h3>
        </div>
        <p>Après 15 ans dans la finance à Paris, Sophie a tout quitté pour s'installer en Provence et vivre de l'apiculture. « Le jour où j'ai ouvert ma première ruche, j'ai su que j'avais trouvé ma place », confie-t-elle.</p>
        <p>Aujourd'hui, elle gère 80 ruches, produit du miel de lavande bio et anime des ateliers de découverte pour les enfants des écoles voisines.</p>
      </div>

      <div class="citation">
        <p>"Les abeilles m'ont appris la patience, l'humilité et le respect du vivant. C'est une leçon qu'aucun bureau ne m'aurait donnée."</p>
        <span>— Sophie, apicultrice en Provence</span>
      </div>

      <div class="story-box">
        <div class="story-header">
          <span class="story-badge">🍯</span>
          <h3>Histoire #2 • Thomas — Le débutant persévérant</h3>
        </div>
        <p>Thomas a perdu sa première colonie dès le premier hiver. Découragé mais pas vaincu, il a suivi une formation, rejoint une association locale et recommencé. Trois ans plus tard, ses 12 ruches prospèrent.</p>
        <p>« L'échec fait partie de l'apprentissage. Chaque erreur m'a rendu meilleur apiculteur. »</p>
      </div>

      <div class="did-you-know">
        <span class="dyk-icon">🐝</span>
        <div>
          <strong>Le saviez-vous ?</strong>
          <p>En France, on compte plus de 75 000 apiculteurs, dont 90% sont des amateurs passionnés qui gèrent moins de 10 ruches !</p>
        </div>
      </div>

      <div class="story-box">
        <div class="story-header">
          <span class="story-badge">🍯</span>
          <h3>Histoire #3 • Henri — La retraite active</h3>
        </div>
        <p>À 67 ans, Henri a découvert l'apiculture grâce à son petit-fils. Ce qui devait être un passe-temps est devenu une véritable passion. Il gère maintenant 6 ruches dans son jardin normand.</p>
        <p>« Mes abeilles me donnent une raison de me lever chaque matin. Et le miel de mon jardin est le meilleur du monde, bien sûr ! » dit-il en riant.</p>
      </div>

      <div class="citation">
        <p>"L'apiculture, c'est comme la vie : il faut savoir observer, écouter et s'adapter. Les abeilles sont les meilleures professeures."</p>
        <span>— Henri, apiculteur retraité en Normandie</span>
      </div>
    `,
  },
  {
    id: "5",
    slug: "quand-les-animaux-sinvitent-chez-les-photographes",
    title: "📸 Quand les animaux s'invitent chez les photographes !",
    excerpt: "Des moments hilarants où la faune a décidé de voler la vedette aux photographes animaliers.",
    category: "buzz",
    tags: ["humour", "animaux", "photographie", "insolite", "buzz"],
    coverImage: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-11-02",
    readTime: 4,
    featured: false,
    views: 12300,
    content: `
      <p>On dit souvent que les abeilles sont imprévisibles… mais attendez de voir ce que font les autres animaux quand un photographe s'installe dans la nature ! 😄</p>

      <h2>🦊 Le renard curieux</h2>
      <p>Un photographe animalier posté dans un affût en forêt a eu la surprise de voir un jeune renard venir renifler son objectif. Résultat : un selfie de renard flou mais absolument adorable. Le cliché est devenu viral avec plus de 2 millions de partages !</p>

      <h2>🐻 L'ours photobomber</h2>
      <p>En Alaska, un photographe National Geographic tentait de capturer un coucher de soleil parfait. Un grizzly a choisi exactement ce moment pour traverser le cadre, se gratter contre un arbre, puis s'asseoir tranquillement devant l'objectif. La photo « Bear at Sunset » a remporté un prix !</p>

      <h2>🐝 L'abeille star</h2>
      <p>Et bien sûr, nos petites protégées ne sont pas en reste ! Un macro-photographe a capturé une abeille qui semblait poser délibérément sur une fleur de tournesol, les pattes pleines de pollen, regardant droit vers l'objectif. La photo parfaite n'existe pa—</p>
      <p>Ah si, elle existe. Et c'est une abeille qui l'a inventée. 🐝✨</p>

      <div class="did-you-know">
        <span class="dyk-icon">🐝</span>
        <div>
          <strong>Le saviez-vous ?</strong>
          <p>Les abeilles peuvent reconnaître les visages humains ! Des chercheurs ont prouvé qu'elles mémorisent les traits faciaux pour identifier les personnes qui s'occupent d'elles.</p>
        </div>
      </div>

      <p><em>Vous avez des anecdotes drôles avec vos abeilles ou d'autres animaux ? Partagez-les en commentaire ! 📸🐝</em></p>
    `,
  },
  {
    id: "6",
    slug: "installer-premiere-ruche-guide-complet",
    title: "🏡 Comment installer sa première ruche — Guide complet",
    excerpt: "Tout ce qu'il faut savoir pour réussir l'installation de votre première ruche au jardin.",
    category: "actualite",
    tags: ["installation", "ruche", "débutant", "jardin", "emplacement"],
    coverImage: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-08-20",
    readTime: 7,
    featured: false,
    views: 2890,
    content: `
      <h2>📍 1. Choisir le bon emplacement</h2>
      <p>L'emplacement de votre ruche est crucial pour le bien-être de vos abeilles. Privilégiez un endroit ensoleillé le matin, à l'abri du vent, avec un point d'eau à proximité.</p>
      <div class="conseil"><p>💡 Conseil : Orientez l'entrée de la ruche vers le sud-est pour que vos abeilles profitent des premiers rayons du soleil.</p></div>

      <h2>📏 2. Respecter la réglementation</h2>
      <p>En France, les distances à respecter varient selon les départements. En général, les ruches doivent être placées à au moins 20 mètres des propriétés voisines, ou 100 mètres des établissements collectifs.</p>

      <h2>🛠️ 3. Préparer le matériel</h2>
      <ul class="checklist">
        <li>Une ruche complète (corps + hausse + toit)</li>
        <li>Un enfumoir et du combustible</li>
        <li>Une combinaison de protection</li>
        <li>Un lève-cadres</li>
        <li>Une brosse à abeilles</li>
      </ul>

      <p>L'installation d'une première ruche est une aventure passionnante. Prenez le temps de bien vous préparer et n'hésitez pas à vous rapprocher d'un rucher-école ou d'une association locale. 🐝</p>
    `,
  },
  {
    id: "7",
    slug: "miel-de-manuka-miracle-ou-marketing",
    title: "🍯 Miel de Manuka : miracle ou marketing ?",
    excerpt: "Analyse objective des propriétés du miel de Manuka et de son prix exorbitant.",
    category: "sante",
    tags: ["manuka", "miel", "santé", "analyse", "nutrition"],
    coverImage: "https://images.unsplash.com/photo-1571745544682-143ea663cf2c?w=800&q=80",
    author: "Le Coin des Apiculteurs",
    date: "2024-07-10",
    readTime: 6,
    featured: false,
    views: 6340,
    content: `
      <h2>🌿 Qu'est-ce que le miel de Manuka ?</h2>
      <p>Le miel de Manuka est produit en Nouvelle-Zélande par des abeilles qui butinent les fleurs du Manuka (Leptospermum scoparium). Il est célèbre pour sa teneur en méthylglyoxal (MGO), un composé aux propriétés antibactériennes.</p>

      <h2>🔬 Ce que dit la science</h2>
      <p>Les études confirment des propriétés antibactériennes supérieures aux miels classiques, notamment contre Staphylococcus aureus. Cependant, la plupart des bienfaits « miraculeux » vantés par le marketing ne sont pas tous prouvés scientifiquement.</p>

      <div class="conseil"><p>💡 Notre avis : Un bon miel local, produit artisanalement, offre aussi d'excellentes propriétés. Ne sous-estimez pas le miel de votre apiculteur de quartier !</p></div>

      <div class="medical-warning">
        <p>⚠️ <strong>Rappel :</strong> Le miel, quel qu'il soit, ne doit jamais être donné aux enfants de moins d'un an (risque de botulisme infantile).</p>
      </div>
    `,
  },
];

export function getArticlesByCategory(category: Category): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getPopularArticles(limit = 8): Article[] {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getCategoryCounts(): Record<Category, number> {
  const counts: Record<Category, number> = { actualite: 0, sante: 0, cours: 0, histoires: 0, buzz: 0 };
  articles.forEach((a) => { counts[a.category]++; });
  return counts;
}
