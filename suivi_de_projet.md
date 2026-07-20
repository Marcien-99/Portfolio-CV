# Suivi de projet : marcien-bn.dev

Ce document rÃ©capitule l'avancement du projet, les fonctionnalitÃ©s implÃ©mentÃ©es, leur fonctionnement, ainsi que d'Ã©ventuelles fonctionnalitÃ©s hors PRD justifiÃ©es.

## Phase C - ImplÃ©mentation

### Fiche 1 â€” Setup initial du projet
- **Statut** : TerminÃ©
- **FonctionnalitÃ©s implÃ©mentÃ©es** : 
  - Projet Next.js avec App Router, TypeScript, et Tailwind CSS v4.
  - Configuration de base shadcn/ui.
  - Structuration de l'arborescence (`/app/(public)`, `/app/(admin)`, `/lib`, `/components`).
  - Fichier `CLAUDE.md` avec le Master Prompt.
  - Initialisation de Git.

### Fiche 2 â€” Design system (composants de base)
- **Statut** : TerminÃ©
- **FonctionnalitÃ©s implÃ©mentÃ©es** :
  - Palette claire (modification par rapport Ã  la spÃ©cification initiale) avec un accent cyan (`#06b6d4` adaptÃ©) configurÃ©e dans `globals.css`.
  - Polices Space Grotesk (titres) et Inter (corps).
  - Composants shadcn/ui de base (Bouton, Badge, Input, Textarea, Card).
  - Composants mÃ©tier : `DomainBadge` avec couleurs spÃ©cifiques par domaine, `SkillCard`, `ExperienceCard`, `ProjectCard` (avec badge de statut et effet hover cyan).
  - Composants de structure : `Header` avec effet glassmorphism, `Footer` (avec icÃ´nes SVG en ligne au lieu de `lucide-react`), `LanguageSelector`.
  - Page de dÃ©monstration `/design-system` regroupant tous ces composants.

### Fiche 3 â€” Contenu rÃ©el du profil
- **Statut** : TerminÃ©
- **FonctionnalitÃ©s implÃ©mentÃ©es** :
  - Fichier `lib/data/seed.ts` crÃ©Ã© avec les vraies donnÃ©es du CV.
  - Types TypeScript stricts alignÃ©s exactement sur la `Spec technique section 2` (tables Supabase).
  - Aucune information inventÃ©e (les champs vides en anglais ou non fournis sont restÃ©s tels quels).

### Fiche 4 â€” Pages publiques
- **Statut** : TerminÃ©
- **FonctionnalitÃ©s implÃ©mentÃ©es** :
  - Mise en place d'une structure multi-pages (Next.js App Router).
  - `page.tsx` (Accueil) : Section Hero avec boutons d'appels Ã  l'action et raccourcis.
  - `a-propos/page.tsx` : Description professionnelle et liste des formations (diplÃ´mes).
  - `competences/page.tsx` : Grille rÃ©pertoriant les expertises groupÃ©es par catÃ©gories (`skillCategories`).
  - `experiences/page.tsx` : Timeline dynamique de l'historique professionnel.
  - `projets/page.tsx` : Liste des projets avec filtres interactifs par domaine cÃ´tÃ© client.
  - `projets/[slug]/page.tsx` : Pages dÃ©tails des projets avec gÃ©nÃ©ration statique (contexte, dÃ©marche, rÃ©sultat).
  - `contact/page.tsx` : Formulaire de contact visuel en utilisant les composants `shadcn/ui`.

## FonctionnalitÃ©s hors PRD et Spec technique
- **Mode Clair** : Le PRD exigeait un thÃ¨me sombre exclusif, mais suite aux retours de l'utilisateur, le thÃ¨me a Ã©tÃ© reconfigurÃ© en mode clair (fonds purs, textes sombres) tout en conservant l'esprit esthÃ©tique et les accents bleus/cyans.
- **IcÃ´nes SVG en ligne** : `lucide-react` ayant supprimÃ© les logos de marques, les icÃ´nes Github et LinkedIn ont Ã©tÃ© implÃ©mentÃ©es directement en SVG dans `Footer.tsx` pour Ã©viter d'ajouter des dÃ©pendances non autorisÃ©es.
- **Animations Premium (GSAP & Micro-interactions CSS)** : Suite Ã  la demande de l'utilisateur de dynamiser le portfolio, implÃ©mentation d'effets de survol (hover CSS natif) sur les cartes et d'animations d'apparition fluides au scroll via la dÃ©pendance `gsap` (ScrollTrigger), isolÃ©es dans un composant `GsapReveal` respectant le cycle de vie serveur/client de Next.js.
- **Ã‰tude de refonte esthÃ©tique (Inspiration Akieni)** : Analyse d'un site de rÃ©fÃ©rence (akieni.com) pour extraire un systÃ¨me de design "Dual-Tone" premium (alternance clair/sombre, typographie forte, motifs architecturaux comme les arches, et cartes minimalistes pastel) dans le but d'appliquer ces principes aux pages publiques du projet.
- **DÃ©ploiement Architecture Dual-Tone** : Refonte structurelle de toutes les pages (`/a-propos`, `/competences`, `/experiences`, `/projets`, `/projets/[slug]`) pour respecter une stricte alternance : *En-tÃªte clair (Titre + Ligne verticale)* vs *Contenu sombre (Grilles/Timelines)*.
- **Galerie de Preuves Visuelles** : Ã‰volution du modÃ¨le de donnÃ©es (`lib/data/seed.ts`) permettant d'attacher un tableau d'images (`gallery`) Ã  chaque projet. Rendu dynamique sous la section "RÃ©sultat" pour renforcer la crÃ©dibilitÃ© technique.
- **IntÃ©gration Photo de Profil** : IntÃ©gration de la vraie photo de l'utilisateur (`Profil.jpg`) avec un masque circulaire, un overlay "plan d'architecte" et des effets d'ombre dynamiques.
- **Gestion de version (GitHub)** : Initialisation du dÃ©pÃ´t Git local et push de la totalitÃ© du code, incluant la refonte graphique complÃ¨te, vers le dÃ©pÃ´t distant `https://github.com/Marcien-99/Portfolio-CV.git`.
- **Mise à jour des informations de contact** : Intégration des vraies coordonnées (email, téléphone, lien LinkedIn) dans la page de contact et le footer en préparation du déploiement.

### Fiche 5 — Schéma Supabase réel (Terminé)
- **Création des tables SQL** : Implémentation complète des tables (profils, compétences, expériences, formations, projets, etc.) et de leurs relations.
- **Sécurité (RLS)** : Activation de Row Level Security (RLS) sur toutes les tables pour limiter l'écriture aux administrateurs, et la lecture au contenu publié.
- **Scripts de test** : Préparation de scripts pour garantir l'étanchéité de la base avant même de coder la logique applicative.

### Fiche 6 — Authentification admin (Terminé)
- **Dépendances** : Installation de @supabase/supabase-js et @supabase/ssr.
- **Middleware** : Création d'un middleware Next.js global qui protège toutes les requêtes vers '/admin/*'.
- **Authentification** : Implémentation d'une page de connexion sécurisée et création des Server Actions pour interagir avec Supabase Auth.
- **Clients Supabase** : Centralisation des appels via des clients générés côté navigateur et côté serveur (dont un mode 'Admin' utilisant la clé service_role).

### Fiche 8a — Back-office Compétences (Terminé)
- **Liste et Formulaire** : CRUD complet des compétences.
- **Sécurité** : Routes protégées par middleware et RLS pour admin.
- **Bascule Rapide** : Changement de statut (Publié/Brouillon) en un clic depuis la liste.

### Fiche 8b — Back-office Expériences et Formations (Terminé)
- **Liste et Formulaire** : CRUD complet des expériences et formations.
- **Mutualisation** : Réutilisation des composants d'actions rapides (DeleteButton) et formulaires adaptés.

### Fiche 8c — Back-office Projets et Médias (Terminé)
- **Liste et Formulaire** : CRUD avancé avec gestion des textes enrichis (Contexte, Démarche, Résultat).
- **Gestion des Liens** : Possibilité d'ajouter des liens externes multiples au projet (ex: GitHub, Demo).
- **Upload vers Supabase Storage** : Upload et gestion de galerie d'images avec ajout de légendes bilingues.
- **Résolution d'erreurs locales** : Utilisation de balises natives `<img>` pour l'affichage de galerie locale afin d'éviter les erreurs strictes de `next/image` sur des fichiers mockés.

## Fonctionnalités Ajoutées (Hors PRD)
- **Gestion fine de l'état (Bascule rapide)** : Ajout de boutons de bascule en 1 clic pour changer l'état ("Brouillon" vers "Publié") directement dans les listes du back-office, pour gagner du temps.
- **Légendes et Liens Multiples sur Projets** : L'ajout de légendes sur chaque image uploadée et la possibilité d'attacher de multiples liens n'étaient pas spécifiés en V1, mais ajoutés pour améliorer la flexibilité du portfolio.

