

// Types matching Supabase Schema (Spec section 2)
export type ItemDomain = 'surete_fonctionnement' | 'electronique' | 'automatisme' | 'informatique_ia';
export type ProjectStatus = 'en_cours' | 'termine';
export type ContentStatus = 'draft' | 'published';

export type SkillCategory = {
  id: string;
  name_fr: string;
  name_en: string;
  position: number;
};

export type Skill = {
  id: string;
  category_id: string;
  name_fr: string;
  name_en: string;
  en_auto_generated: boolean;
  level?: number;
  status: ContentStatus;
  position: number;
  domains: ItemDomain[];
};

export type Experience = {
  id: string;
  title_fr: string;
  title_en: string;
  company: string;
  location?: string;
  start_date: string; // ISO string (YYYY-MM-DD)
  end_date?: string;  // null = poste actuel
  description_fr?: string;
  description_en?: string;
  en_auto_generated: boolean;
  status: ContentStatus;
  position: number;
  domains: ItemDomain[];
};

export type Education = {
  id: string;
  title_fr: string;
  title_en: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description_fr?: string;
  description_en?: string;
  en_auto_generated: boolean;
  status: ContentStatus;
  position: number;
  domains: ItemDomain[];
};

export type ProjectGalleryImage = {
  src: string;
  description: string;
};

export type Project = {
  id: string;
  title_fr: string;
  title_en: string;
  slug: string;
  context_fr?: string;
  context_en?: string;
  approach_fr?: string;
  approach_en?: string;
  result_fr?: string;
  result_en?: string;
  en_auto_generated: boolean;
  status: ProjectStatus;
  visibility: ContentStatus;
  position: number;
  domains: ItemDomain[];
  gallery?: ProjectGalleryImage[];
};

// --- DATA ---

const catSureteId = "c1000000-0000-0000-0000-000000000001";
const catElectroId = "c1000000-0000-0000-0000-000000000002";
const catInfoId = "c1000000-0000-0000-0000-000000000003";
const catIotId = "c1000000-0000-0000-0000-000000000004";
const catLangId = "c1000000-0000-0000-0000-000000000005";

export const skillCategories: SkillCategory[] = [
  { id: catSureteId, name_fr: "Sûreté de fonctionnement", name_en: "", position: 1 },
  { id: catElectroId, name_fr: "Électronique", name_en: "", position: 2 },
  { id: catInfoId, name_fr: "Informatique", name_en: "", position: 3 },
  { id: catIotId, name_fr: "IOT", name_en: "", position: 4 },
  { id: catLangId, name_fr: "Langues", name_en: "", position: 5 },
];

export const skills: Skill[] = [
  // Sûreté de fonctionnement
  { id: "s1000000-0000-0000-0000-000000000001", category_id: catSureteId, name_fr: "Analyse fonctionnelle (APTE, SADT, FAST)", name_en: "", en_auto_generated: true, status: "published", position: 1, domains: ["surete_fonctionnement"] },
  { id: "s1000000-0000-0000-0000-000000000002", category_id: catSureteId, name_fr: "Analyse des risques (AMDEC, APR, FTA)", name_en: "", en_auto_generated: true, status: "published", position: 2, domains: ["surete_fonctionnement"] },
  { id: "s1000000-0000-0000-0000-000000000003", category_id: catSureteId, name_fr: "Modélisation (RdP, Markov, SysML, UML)", name_en: "", en_auto_generated: true, status: "published", position: 3, domains: ["surete_fonctionnement"] },
  { id: "s1000000-0000-0000-0000-000000000004", category_id: catSureteId, name_fr: "Analyse de sécurité par les modèles MBSE-MBSA", name_en: "", en_auto_generated: true, status: "published", position: 4, domains: ["surete_fonctionnement"] },
  { id: "s1000000-0000-0000-0000-000000000005", category_id: catSureteId, name_fr: "Fiabilité prévisionnelle (FIDES, MIL-HDBK217, IEC62380, Item Toolkit, ExperTool)", name_en: "", en_auto_generated: true, status: "published", position: 5, domains: ["surete_fonctionnement"] },
  { id: "s1000000-0000-0000-0000-000000000006", category_id: catSureteId, name_fr: "Fiabilité opérationnelle (Monte-Carlo, FRACASS, MTBF/MTTR/MTTF)", name_en: "", en_auto_generated: true, status: "published", position: 6, domains: ["surete_fonctionnement"] },
  { id: "s1000000-0000-0000-0000-000000000007", category_id: catSureteId, name_fr: "Normes CENELEC EN 50126/50128/50129, ISO 26262, ISO 9001", name_en: "", en_auto_generated: true, status: "published", position: 7, domains: ["surete_fonctionnement"] },

  // Électronique
  { id: "s2000000-0000-0000-0000-000000000001", category_id: catElectroId, name_fr: "Systèmes embarqués (AOP, FPGA/CPLD, BMS, ESP32)", name_en: "", en_auto_generated: true, status: "published", position: 1, domains: ["electronique"] },
  { id: "s2000000-0000-0000-0000-000000000002", category_id: catElectroId, name_fr: "Électronique de puissance (moteurs à induction, variateurs, convertisseurs)", name_en: "", en_auto_generated: true, status: "published", position: 2, domains: ["electronique"] },
  { id: "s2000000-0000-0000-0000-000000000003", category_id: catElectroId, name_fr: "Conception PCB / CAO", name_en: "", en_auto_generated: true, status: "published", position: 3, domains: ["electronique"] },

  // Informatique
  { id: "s3000000-0000-0000-0000-000000000001", category_id: catInfoId, name_fr: "C/C++, VHDL, Python, Machine Learning, Excel VBA", name_en: "", en_auto_generated: true, status: "published", position: 1, domains: ["informatique_ia"] },
  { id: "s3000000-0000-0000-0000-000000000002", category_id: catInfoId, name_fr: "HTML/CSS, Java/JavaScript", name_en: "", en_auto_generated: true, status: "published", position: 2, domains: ["informatique_ia"] },
  { id: "s3000000-0000-0000-0000-000000000003", category_id: catInfoId, name_fr: "OpenCV, PyQt5, Next.js, Supabase, Vercel (Vibe Coding)", name_en: "", en_auto_generated: true, status: "published", position: 3, domains: ["informatique_ia"] },

  // IOT
  { id: "s4000000-0000-0000-0000-000000000001", category_id: catIotId, name_fr: "LoRaWAN, Zigbee, Arduino/Cloud", name_en: "", en_auto_generated: true, status: "published", position: 1, domains: ["electronique", "informatique_ia"] },

  // Langues
  { id: "s5000000-0000-0000-0000-000000000001", category_id: catLangId, name_fr: "Français (courant)", name_en: "", en_auto_generated: true, status: "published", position: 1, domains: [] },
  { id: "s5000000-0000-0000-0000-000000000002", category_id: catLangId, name_fr: "Anglais (B2)", name_en: "", en_auto_generated: true, status: "published", position: 2, domains: [] }
];

export const experiences: Experience[] = [
  {
    id: "e1000000-0000-0000-0000-000000000001",
    title_fr: "Ingénieur RAMS | Stage de fin d'études",
    title_en: "",
    company: "Faiveley Transport",
    location: "Ville-aux-Dames",
    start_date: "2024-03-01",
    end_date: "2024-08-31",
    description_fr: "Amélioration des études de fiabilité prévisionnelle sur des équipements électroniques en tenant compte du retour d'expérience.\n- Évaluation de la fiabilité prévisionnelle contractuelle selon MIL-HDBK217 et IEC62380\n- Mesure de fiabilité opérationnelle (MTBF, MTTF) et détermination des coefficients de rex\n- Réévaluation de la fiabilité prévisionnelle\n- Mise en place d'une méthodologie générale d'amélioration des études de fiabilité\n- Création d'un outil logiciel de calcul de fiabilité opérationnelle développé en Python\n- Mise à jour des études de sécurité sur un BRS conformément aux normes EN 50126/EN 50129",
    description_en: "",
    en_auto_generated: true,
    status: "published",
    position: 1,
    domains: ["surete_fonctionnement", "informatique_ia"]
  },
  {
    id: "e2000000-0000-0000-0000-000000000001",
    title_fr: "Ingénieur Fiabilité | Projet en Entreprise",
    title_en: "",
    company: "DGA",
    location: "Bruz",
    start_date: "2023-10-01",
    end_date: "2024-02-28", // Approximative based on "Octobre 2023-Février 2024 (20 jours)"
    description_fr: "Étude de la confiance et de la pertinence des résultats obtenus avec une méthode FIDES allégée pour définir le profil de vie.\n- Calcul de la fiabilité prévisionnelle conformément à FIDES\n- Réduction des phases du profil de mission FIDES\n- Mise en place d'une méthode générale de réduction des phases",
    description_en: "",
    en_auto_generated: true,
    status: "published",
    position: 2,
    domains: ["surete_fonctionnement"]
  },
  {
    id: "e3000000-0000-0000-0000-000000000001",
    title_fr: "Développeur Python | Stage de fin d'études",
    title_en: "",
    company: "Yazaki Morocco",
    location: "Tanger",
    start_date: "2023-03-01",
    end_date: "2023-08-31",
    description_fr: "- Digitalisation des documents dans les ateliers d'assemblage\n- Automatisation du processus de documentation (Python, OpenCV)\n- Développement d'une interface logiciel desktop (Agile Scrum, PyQt5, Jira)\n(voir aussi le projet détaillé \"Détection de contour pour câblage automobile\")",
    description_en: "",
    en_auto_generated: true,
    status: "published",
    position: 3,
    domains: ["informatique_ia", "surete_fonctionnement"]
  },
  {
    id: "e4000000-0000-0000-0000-000000000001",
    title_fr: "Concepteur Électronique | Stage de fin d'année",
    title_en: "",
    company: "Media Caris SARL",
    location: "Tanger",
    start_date: "2022-07-01",
    end_date: "2022-09-30",
    description_fr: "- Conception et optimisation des cartes électroniques pour applications IOT\n- Conception du circuit imprimé (KiCad, Eagle PCB)\n- Réalisation de terminaux IOT pour le transfert et la collecte de données via LoRaWan et Zigbee",
    description_en: "",
    en_auto_generated: true,
    status: "published",
    position: 4,
    domains: ["electronique"]
  },
  {
    id: "e5000000-0000-0000-0000-000000000001",
    title_fr: "Stagiaire Maintenance Prédictive – Recherche",
    title_en: "",
    company: "Smart Automation Technologies",
    location: "Tanger",
    start_date: "2021-08-01",
    end_date: "2021-09-30",
    description_fr: "Maintenance prédictive de véhicules lourds (edge computing, machine learning)",
    description_en: "",
    en_auto_generated: true,
    status: "published",
    position: 5,
    domains: ["surete_fonctionnement", "electronique", "informatique_ia"]
  }
];

export const educations: Education[] = [
  {
    id: "ed100000-0000-0000-0000-000000000000",
    title_fr: "Certification System Dependability",
    title_en: "",
    institution: "SEAM Online / INSA Toulouse",
    start_date: "2025-08-01",
    end_date: "2025-09-30",
    en_auto_generated: true,
    status: "published",
    position: 1,
    domains: []
  },
  {
    id: "ed200000-0000-0000-0000-000000000000",
    title_fr: "Certification Functional Safety and ISO 26262",
    title_en: "",
    institution: "Udemy",
    start_date: "2025-03-01",
    end_date: "2025-05-31",
    en_auto_generated: true,
    status: "published",
    position: 2,
    domains: []
  },
  {
    id: "ed300000-0000-0000-0000-000000000000",
    title_fr: "Master 2 Fiabilité et Sûreté de Fonctionnement",
    title_en: "",
    institution: "Polytech Angers",
    start_date: "2023-08-01",
    end_date: "2024-08-31",
    en_auto_generated: true,
    status: "published",
    position: 3,
    domains: []
  },
  {
    id: "ed400000-0000-0000-0000-000000000000",
    title_fr: "Cycle d'ingénieur : Génie des Systèmes Électroniques et Automatiques",
    title_en: "",
    institution: "ENSA Tanger",
    start_date: "2020-09-01",
    end_date: "2023-08-31",
    en_auto_generated: true,
    status: "published",
    position: 4,
    domains: []
  },
  {
    id: "ed500000-0000-0000-0000-000000000000",
    title_fr: "Classes Préparatoires Intégrées",
    title_en: "",
    institution: "ENSA Tanger",
    start_date: "2018-09-01",
    end_date: "2020-08-31",
    en_auto_generated: true,
    status: "published",
    position: 5,
    domains: []
  }
];

export const projects: Project[] = [
  {
    id: "p1000000-0000-0000-0000-000000000000",
    title_fr: "Détection de contour pour câblage automobile",
    title_en: "",
    slug: "detection-contour-cablage",
    context_fr: "Le processus classique de câblage automobile utilisait Excel de façon manuelle — l'opérateur devait lui-même écrire les informations sur les cavités des connecteurs, source d'erreurs et sans centralisation des données.",
    approach_fr: "Développement d'une application desktop en Python (architecture MVC), avec détection de contour (circulaire, rectangulaire...) sur image de connecteur, seuil de détection ajustable, sélection et suppression manuelle de contour possibles, interface graphique réalisée avec Qt Designer. Participation à la phase avant-projet : recueil du besoin, analyse fonctionnelle, rédaction des user stories, interaction avec le Product Backlog, environnement agile (2 sprints réalisés).",
    result_fr: "À partir d'une simple image de connecteur et d'un fichier Excel d'informations, l'application génère automatiquement une image labellisée indiquant à l'opérateur quel fil placer sur quelle cavité et de quelle couleur, stockée directement dans la base de données de l'entreprise.",
    en_auto_generated: true,
    status: "termine",
    visibility: "published",
    position: 1,
    domains: ["informatique_ia", "surete_fonctionnement", "electronique"],
    gallery: [
      { src: "/connectB1.jpeg", description: "Image du connecteur original avant traitement." },
      { src: "/connectB1_info.png", description: "Image du connecteur après détection et labellisation par l'application." }
    ]
  },
  {
    id: "p2000000-0000-0000-0000-000000000000",
    title_fr: "Microcontrôleur virtuel sur FPGA",
    title_en: "",
    slug: "microcontroleur-virtuel-fpga",
    context_fr: "Conception en VHDL avec Quartus d'un microcontrôleur virtuel en architecture RISC : implémentation d'une unité arithmétique et logique (UAL), registres, mémoire, et définition du jeu d'instructions.",
    en_auto_generated: true,
    status: "termine",
    visibility: "published",
    position: 2,
    domains: ["electronique"]
  },
  {
    id: "p3000000-0000-0000-0000-000000000000",
    title_fr: "Kleleyu Shop",
    title_en: "",
    slug: "kleleyu-shop",
    context_fr: "Site e-commerce propriétaire (produits physiques et digitaux) développé avec Next.js, Supabase et Vercel, méthodologie de développement documentée avec agent IA (PRD, spec technique, fiches de tâche).",
    en_auto_generated: true,
    status: "en_cours",
    visibility: "published",
    position: 3,
    domains: ["informatique_ia"]
  },
  {
    id: "p4000000-0000-0000-0000-000000000000",
    title_fr: "marcien-bn.dev",
    title_en: "",
    slug: "marcien-bn-dev",
    context_fr: "Portfolio CV intelligent, ce site lui-même — générateur de CV multi-profils, architecture Next.js/Supabase/Vercel, développé avec la même méthodologie documentée que Kleleyu Shop.",
    en_auto_generated: true,
    status: "en_cours",
    visibility: "published",
    position: 4,
    domains: ["informatique_ia"]
  }
];
