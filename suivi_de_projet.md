# Suivi de projet : marcien-bn.dev

Ce document récapitule l'avancement du projet, les fonctionnalités implémentées, leur fonctionnement, ainsi que d'éventuelles fonctionnalités hors PRD justifiées.

## Phase C - Implémentation

### Fiche 1 — Setup initial du projet
- **Statut** : Terminé
- **Fonctionnalités implémentées** : 
  - Projet Next.js avec App Router, TypeScript, et Tailwind CSS v4.
  - Configuration de base shadcn/ui.
  - Structuration de l'arborescence (`/app/(public)`, `/app/(admin)`, `/lib`, `/components`).
  - Fichier `CLAUDE.md` avec le Master Prompt.
  - Initialisation de Git.

### Fiche 2 — Design system (composants de base)
- **Statut** : Terminé
- **Fonctionnalités implémentées** :
  - Palette claire (modification par rapport à la spécification initiale) avec un accent cyan (`#06b6d4` adapté) configurée dans `globals.css`.
  - Polices Space Grotesk (titres) et Inter (corps).
  - Composants shadcn/ui de base (Bouton, Badge, Input, Textarea, Card).
  - Composants métier : `DomainBadge` avec couleurs spécifiques par domaine, `SkillCard`, `ExperienceCard`, `ProjectCard` (avec badge de statut et effet hover cyan).
  - Composants de structure : `Header` avec effet glassmorphism, `Footer` (avec icônes SVG en ligne au lieu de `lucide-react`), `LanguageSelector`.
  - Page de démonstration `/design-system` regroupant tous ces composants.

### Fiche 3 — Contenu réel du profil
- **Statut** : Terminé
- **Fonctionnalités implémentées** :
  - Fichier `lib/data/seed.ts` créé avec les vraies données du CV.
  - Types TypeScript stricts alignés exactement sur la `Spec technique section 2` (tables Supabase).
  - Aucune information inventée (les champs vides en anglais ou non fournis sont restés tels quels).

### Fiche 4 — Pages publiques
- **Statut** : Terminé
- **Fonctionnalités implémentées** :
  - Mise en place d'une structure multi-pages (Next.js App Router).
  - `page.tsx` (Accueil) : Section Hero avec boutons d'appels à l'action et raccourcis.
  - `a-propos/page.tsx` : Description professionnelle et liste des formations (diplômes).
  - `competences/page.tsx` : Grille répertoriant les expertises groupées par catégories (`skillCategories`).
  - `experiences/page.tsx` : Timeline dynamique de l'historique professionnel.
  - `projets/page.tsx` : Liste des projets avec filtres interactifs par domaine côté client.
  - `projets/[slug]/page.tsx` : Pages détails des projets avec génération statique (contexte, démarche, résultat).
  - `contact/page.tsx` : Formulaire de contact visuel en utilisant les composants `shadcn/ui`.

## Fonctionnalités hors PRD et Spec technique
- **Mode Clair** : Le PRD exigeait un thème sombre exclusif, mais suite aux retours de l'utilisateur, le thème a été reconfiguré en mode clair (fonds purs, textes sombres) tout en conservant l'esprit esthétique et les accents bleus/cyans.
- **Icônes SVG en ligne** : `lucide-react` ayant supprimé les logos de marques, les icônes Github et LinkedIn ont été implémentées directement en SVG dans `Footer.tsx` pour éviter d'ajouter des dépendances non autorisées.
- **Animations Premium (GSAP & Micro-interactions CSS)** : Suite à la demande de l'utilisateur de dynamiser le portfolio, implémentation d'effets de survol (hover CSS natif) sur les cartes et d'animations d'apparition fluides au scroll via la dépendance `gsap` (ScrollTrigger), isolées dans un composant `GsapReveal` respectant le cycle de vie serveur/client de Next.js.
- **Étude de refonte esthétique (Inspiration Akieni)** : Analyse d'un site de référence (akieni.com) pour extraire un système de design "Dual-Tone" premium (alternance clair/sombre, typographie forte, motifs architecturaux comme les arches, et cartes minimalistes pastel) dans le but d'appliquer ces principes aux pages publiques du projet.
