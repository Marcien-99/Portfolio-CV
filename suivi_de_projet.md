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
- **Déploiement Architecture Dual-Tone** : Refonte structurelle de toutes les pages (`/a-propos`, `/competences`, `/experiences`, `/projets`, `/projets/[slug]`) pour respecter une stricte alternance : *En-tête clair (Titre + Ligne verticale)* vs *Contenu sombre (Grilles/Timelines)*.
- **Galerie de Preuves Visuelles** : Évolution du modèle de données (`lib/data/seed.ts`) permettant d'attacher un tableau d'images (`gallery`) à chaque projet. Rendu dynamique sous la section "Résultat" pour renforcer la crédibilité technique.
- **Intégration Photo de Profil** : Intégration de la vraie photo de l'utilisateur (`Profil.jpg`) avec un masque circulaire, un overlay "plan d'architecte" et des effets d'ombre dynamiques.
- **Gestion de version (GitHub)** : Initialisation du dépôt Git local et push de la totalité du code, incluant la refonte graphique complète, vers le dépôt distant `https://github.com/Marcien-99/Portfolio-CV.git`.
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

### Fiche 9 — Profils de CV et photo active (Terminé)
- **Gestion de la Photo** : Upload et sélection exclusive d'une photo active pour la génération du CV PDF.
- **Profil Standard** : Interface d'administration pour sélectionner finement quelles compétences, expériences, formations et projets inclure dans le CV.
- **Base de données** : Nouvelles tables (`cv_profiles`, `cv_profile_items`, `cv_photos`) et sécurisation complète par RLS.

### Fiche 9bis — Traduction automatique (DeepL) (Terminé)
- **Dépendance** : Installation de `deepl-node` pour communiquer avec l'API.
- **Logique** : Création d'un module centralisé `/lib/translate.ts` capable de traduire efficacement en lot.
- **Interception** : Modification des Server Actions (Projets, Expériences, Formations, Compétences) pour intercepter la sauvegarde et traduire les champs français vers l'anglais si le champ `en_auto_generated` est activé.
- **Indicateur de révision** : Ajout d'une colonne "Traduction EN" dans les listes du back-office, affichant un badge interactif "Non relu".
- **Action de validation** : Création de la fonction `reviewTranslation` déclenchée depuis le badge pour confirmer la relecture manuelle (passage à `en_auto_generated = false`).

## Fonctionnalités Ajoutées (Hors PRD)
- **Gestion fine de l'état (Bascule rapide)** : Ajout de boutons de bascule en 1 clic pour changer l'état ("Brouillon" vers "Publié") directement dans les listes du back-office, pour gagner du temps.
- **Légendes et Liens Multiples sur Projets** : L'ajout de légendes sur chaque image uploadée et la possibilité d'attacher de multiples liens n'étaient pas spécifiés en V1, mais ajoutés pour améliorer la flexibilité du portfolio.
- **Modification du mot de passe admin** : Ajout d'un encart "Sécurité" dans les réglages du back-office permettant de modifier facilement son mot de passe de connexion à l'application. Cette fonctionnalité inclut une vérification stricte de l'ancien mot de passe, une confirmation du nouveau mot de passe, et des boutons (icônes d'œil) pour afficher/masquer la saisie sur l'ensemble des champs.
- **Réglages globaux (Site Settings)** : Implémentation de la page de réglages (qui était prévue mais sans fiche détaillée) permettant de configurer les informations de la page d'accueil (années d'expérience, nombre de projets manuel ou automatique, localisation). Ajout des champs pour modifier les informations de contact (email, téléphone, adresse) et les liens des réseaux sociaux (LinkedIn, GitHub) avec répercussion sur le site public.
- **Référencement (SEO)** : Ajout de champs dans les réglages pour modifier dynamiquement les balises Meta Title et Meta Description du site global.
- **Gestion des Catégories** : Création d'une page d'administration (`/admin/categories`) permettant un CRUD complet sur les catégories de compétences afin de les ajouter ou de les modifier sans toucher au code ou à la base de données manuellement.
- **Refonte UI du Back-office** : Application du design system "Dual-Tone" à l'interface d'administration. Ajout d'un tableau de bord affichant les statistiques réelles, intégration d'un indicateur de navigation actif (`NavItem`), création d'un composant premium pour les demandes de confirmation de suppression (`ConfirmActionDialog`), et amélioration du design des champs de date dans les formulaires.
- **Traduction Globale du Site (i18n)** : Implémentation du système multilingue FR/EN par URL (`/[lang]/...`). Mise en place d'un middleware pour la détection et la redirection vers la bonne langue via un cookie `NEXT_LOCALE`. Mise à jour du header avec un `LanguageSelector` et traduction automatique des interfaces publiques via des dictionnaires statiques. Ajout des traductions pour les libellés "En cours", "Terminé", "Tous droits réservés", "Navigation", "Accueil" et l'ensemble des pages projets dynamiques et des badges des domaines.
- **Refonte UI du Formulaire de Login Admin** : Harmonisation de la page de connexion restreinte (`/admin/login`) avec l'esthétique premium sombre (Dual-Tone) du site. Ajout d'un bouton (icône d'œil) permettant d'afficher ou de masquer le mot de passe lors de la saisie pour plus de praticité.
- **Navigation transversale** : Ajout d'un bouton "Retour au site" explicite dans la barre latérale d'administration pour permettre un retour fluide vers le côté public du site.
- **Sécurité stricte (Session Admin)** : Modification du comportement des cookies d'authentification pour utiliser des cookies de session purs (qui expirent à la fermeture du navigateur). Remise en place d'une déconnexion automatique immédiate dès qu'un administrateur visite la partie publique du site (corrigé pour ignorer le prefetching Next.js afin de ne pas bloquer la navigation interne).
- **Galerie d'images plein écran (Lightbox)** : Ajout d'une fonctionnalité interactive côté public permettant aux visiteurs de cliquer sur les images de preuve visuelle d'un projet pour les afficher en taille réelle dans une fenêtre modale (Lightbox), incluant la gestion de la légende bilingue et des contrôles de fermeture fluides.
- **Traduction à la volée (DeepL client)** : Ajout de boutons interactifs dans les formulaires d'administration pour traduire instantanément les champs du français vers l'anglais avant de sauvegarder. Permet à l'utilisateur de prévisualiser et corriger la traduction de l'IA sans avoir à sauvegarder et rouvrir le formulaire.
- **Traduction automatique intelligente** : Retrait de la case à cocher pour la traduction automatique et remplacement par une logique intelligente en arrière-plan. Le système traduit désormais uniquement les champs anglais vides (si la version française est remplie) lors de la sauvegarde, sans jamais écraser une traduction déjà existante (manuelle ou via DeepL). Déplacement du bouton global "Tout traduire" en haut des formulaires pour plus d'ergonomie.

### Fiche 11 — Formulaire de contact réel (Terminé)
- **Validation serveur (Zod)** : Implémentation d'un contrôle strict des données soumises via la page de contact (prénom, nom, email, sujet, message) pour garantir la sécurité et l'intégrité des données reçues.
- **Envoi d'email via Resend** : Création d'une Server Action qui utilise le SDK Resend pour envoyer de manière sécurisée les messages soumis à l'adresse de l'administrateur.
- **Honeypot Anti-spam** : Mise en place d'un champ caché (invisible pour les utilisateurs normaux) pour piéger les bots spammeurs. Si le champ est rempli, la requête est silencieusement ignorée côté serveur.
- **Client Component React 19** : Refactorisation de la partie "formulaire" de la page contact en un `ContactForm.tsx` interactif utilisant `useActionState` pour gérer correctement les états de chargement, de succès et d'erreurs (validation inline).

### Fiche 10 – Génération PDF à la demande (Terminé)
- **Librairie** : Installation de @react-pdf/renderer pour générer le PDF.
- **Service** : Création d'un service de Data Fetching robuste côté serveur récupérant les infos globales (Settings, Photo active) et l'ensemble des éléments attachés au profil de CV sélectionné (compétences par catégories, expériences, projets). Normalisation de la donnée pour injecter uniquement la langue demandée.
- **Template Visuel** : Développement du layout du PDF (modèle Standard V1) sans utiliser Tailwind CSS, mais en utilisant les primitives <Document>, <Page> de @react-pdf/renderer et le système interne de StyleSheet. Utilisation de la police intégrée Helvetica et Helvetica-Bold pour la rapidité de génération et l'absence totale de problèmes de chargement réseau.
- **Route Handler** : Mise en place d'une route API GET (/api/cv/[profileId]/[lang]) qui assemble les données et renvoie directement le fichier via renderToStream à l'utilisateur (Content-Disposition: attachment), permettant de contourner les limites Vercel grâce à l'absence de stockage disque/Supabase.

- **Centres d'intérêt (CV - Hors PRD)** : Ajout de champs dans les réglages du site permettant de définir des centres d'intérêt en français et en anglais qui s'affichent automatiquement à la fin du CV PDF.
- **Traduction contextuelle (Hors PRD)** : Implémentation du composant TranslateFieldButton directement dans la page de réglages pour permettre la traduction immédiate des centres d'intérêt via l'API DeepL, sans quitter le formulaire.

- **Brouillons sur le CV (Hors PRD)** : Modification du générateur PDF pour qu'il inclue les éléments cochés dans le profil de CV, même s'ils sont en statut brouillon sur le site public.
- **Période des projets (Hors PRD)** : Ajout des colonnes start_date, end_date et show_dates à la table projects, permettant de définir des dates pour les projets et de choisir de les afficher ou non publiquement.

### Modifications récentes
- **Garde-fou Date de Fin (Projets)** : Ajout d'une règle de validation stricte (Zod) forçant l'administrateur à définir une date de fin (end_date) lorsque le statut du projet est basculé sur 'termine'. Si la date est manquante, le formulaire affiche une erreur et bloque l'enregistrement. Ceci n'était pas explicite dans les spécifications initiales mais ajouté pour garantir la cohérence des données.
- **Dialogue personnalisé Date de Fin (Projets)** : Remplacement de l'alerte par défaut du navigateur par une fenêtre modale (dialogue) sur mesure, parfaitement intégrée au design du back-office, empêchant la sauvegarde et invitant l'utilisateur à renseigner la date manquante.
- **Correction Déploiement Vercel** : Résolution des erreurs de compilation TypeScript strictes sur Vercel (migration de `middleware.ts` vers `proxy.ts` pour Next.js 16, cast explicite pour `@react-pdf/renderer` et correction des noms de champs pour la génération PDF des projets).
- **Afficher le Contexte et les Dates des Projets sur le CV (Hors PRD)** : Modification du générateur de CV (`generate.ts` et `standard.tsx`) afin que la description des projets sur le PDF reprenne directement le champ Contexte (`context_fr` / `context_en`), affiché proprement sans le mot "Contexte". Ajout de l'affichage des dates des projets sur le PDF (si l'option `show_dates` est active pour le projet concerné). Dans le back-office (`/admin/cv-profils`), les projets en brouillon arborent désormais un badge `(Brouillon CV)` explicite, permettant à l'administrateur de facilement cocher et sélectionner une version courte/réduite d'un projet créée spécialement pour le CV sans qu'elle n'apparaisse sur le site public.
- **Ordre personnalisable des sections sur le CV (Hors PRD)** : Ajout de la colonne `projects_before_experiences` dans la table `cv_profiles` (via le fichier de migration SQL `20260726000000_add_cv_profiles_projects_first.sql`) et intégration d'un interrupteur (toggle) ergonomique dans l'onglet "Profils de CV" du back-office. Permet à l'administrateur de choisir en 1 clic d'afficher la section "Projets" avant ou après la section "Expériences Professionnelles" sur la version PDF (très utile pour mettre en avant ses réalisations techniques dès l'en-tête du CV).
- **Exclusion des brouillons dans le compteur de projets (Hors PRD)** : Modification du calcul des statistiques sur le tableau de bord administrateur (`/admin`) pour que le compteur de projets ignore les projets en brouillon (`visibility = 'draft'`). Ainsi, les versions courtes ou doublons de projets créés exclusivement pour le CV n'altèrent pas le nombre total affiché dans l'indicateur.
- **Phase 1 — Multi-profils de CV dans l'administration, Bios et Aperçu PDF (Hors PRD)** :
  - **Migration SQL** : Ajout de colonnes de personnalisation dans `cv_profiles` (`bio_fr`, `bio_en`, `show_github`, `is_public`, `skills_order`).
  - **Gestion multi-profils dans `/admin/cv-profils`** : Refonte de la page administrative avec une barre d'onglets pour naviguer entre les différents profils de CV (ex: *Ingénieur Logiciel*, *RAMS & Électronique*), un bouton **"+ Nouveau profil"**, et un bouton **"Supprimer"**. Chaque profil sauvegarde indépendamment sa propre sélection de compétences, expériences, formations et projets.
  - **Panneau de personnalisation & Magie de Traduction** : Ajout d'un encart pour définir un résumé spécifique au profil (Bio FR/EN), avec intégration du bouton de traduction automatique (DeepL) **"✨"** sur le champ Bio EN. Ajout d'interrupteurs pour afficher ou masquer le lien GitHub, et pour rendre le CV disponible au téléchargement public.
  - **Aperçu PDF instantané** : Intégration d'un bouton **"👁️ Aperçu PDF"** ouvrant une modale grand format avec un lecteur PDF en direct (`<iframe src="/api/cv/[id]/[lang]?inline=true" />`), permettant d'inspecter le rendu réel du CV (FR et EN) sans quitter le back-office.
  - **Amélioration UX et Résolution d'erreurs (Modales)** : Affichage direct des messages d'erreur de base de données à l'intérieur des modales de création et de suppression (permettant de visualiser immédiatement un éventuel oubli d'exécution de script SQL sur Supabase), et fermeture correcte / réinitialisation des erreurs lors de l'annulation.
  - **Résolution critique (Doublons fantômes & Erreur 42703 `created_at`)** : Diagnostic et résolution de l'erreur SQL 42703 silencieuse provoquée par les requêtes de tri `.order('created_at')` sur la table `cv_profiles` (cette colonne étant absente du schéma initial SQL). Cette erreur faisait échouer la récupération des profils par le front-end et déclenchait par fallback l'insertion incontrôlée de profils fantômes "Standard" en double à chaque rafraîchissement, faussant le compteur du tableau de bord et décochant les éléments sur l'interface. Suppression du tri `created_at` sur `cv_profiles` dans `lib/actions/cv.ts` et exécution d'un script de nettoyage complet de la base de données Supabase pour purger tous les profils fantômes tout en préservant le profil Standard légitime et le profil personnalisé créé.
  - **Refonte Générateur PDF** : Refonte de `getCvPdfData` pour qu'il charge le profil exact demandé (`getProfileByIdOrDefault`), injecte sa bio personnalisée (FR/EN) et respecte le masquage de GitHub sur le PDF généré.

- **Phase 2 — L'Intelligence du PDF : Tri dynamique des compétences & Règles d'affichage (Hors PRD)** :
  - **Encart interactif de tri dans `/admin/cv-profils`** : Ajout d'une section interactive "Ordre de priorité des catégories de compétences sur le CV". Chaque catégorie (Informatique, Sûreté, Électronique, IOT, Langues, Automatisme) est affichée sous forme de badge numéroté (`#1`, `#2`...) assorti de boutons fléchés (`⬆️` / `⬇️`) permettant de monter ou descendre la catégorie. Le nouvel ordre est synchronisé instantanément dans l'état et sauvegardé en base de données dans la colonne `skills_order` du profil actif.
  - **Tri dynamique dans le moteur PDF (`lib/pdf/generate.ts`)** : Mise à jour de `getCvPdfData` pour interroger l'ordre personnalisé (`profile.skills_order`) et réorganiser dynamiquement l'affichage de la barre latérale des compétences sur le CV généré en direct (PDF `@react-pdf/renderer`). Le document final reflète fidèlement la priorité exacte des domaines définie par l'utilisateur pour le profil sélectionné.

- **Phase 3 — La Vitrine Publique : Téléchargement multi-profils à la carte (Hors PRD)** :
  - **Composant réutilisable `<DownloadCvButton />`** : Création d'un composant client intelligent dans `components/public/DownloadCvButton.tsx` pour remplacer les simples liens statiques de téléchargement de CV.
  - **Comportement adaptatif (1 profil vs 2+ profils)** :
    - *Cas 1 (1 seul profil public)* : Le bouton fonctionne comme un lien de téléchargement direct (`<a download>`) pointant vers le profil actif (ou Standard par défaut).
    - *Cas 2 (2 profils publics ou plus)* : Le clic sur le bouton ouvre une magnifique modale interactive au design sombre ("glassmorphism" avec flou d'arrière-plan, animations douces et cartes interactives). Le visiteur peut y visualiser la liste des profils disponibles (ex: *CV — Ingénieur Logiciel*, *CV — RAMS & Électronique*) et cliquer sur le profil de son choix pour déclencher immédiatement son téléchargement au format PDF.
  - **Intégration globale sur tout le site** :
    - **Header (Navigation supérieure)** : Intégration dans `components/layout/Header.tsx` avec gestion responsive (affichage de l'icône seule sur mobile, texte complet sur desktop).
    - **Section Hero (Accueil)** : Remplacement du bouton statique dans `app/(public)/[lang]/page.tsx` pour un téléchargement interactif dès le premier écran.
    - **Footer (Pied de page)** : Ajout inédit d'un bouton de téléchargement de CV dans `components/layout/Footer.tsx`, offrant un point de conversion direct aux recruteurs qui ont défilé jusqu'au bas de page.
  - **Performance et Zéro Latence** : Création d'une Server Action `getPublicProfiles()` dans `lib/actions/cv.ts` qui filtre les profils par `is_public = true` (en triant le profil par défaut en premier). Les profils sont pré-chargés côté serveur dans `PublicLayout` et injectés directement dans le HTML initial : aucune attente de chargement (spinner) pour le visiteur.
  - **Résolution du rognage visuel (React Portal)** : Modification du composant `<DownloadCvButton />` pour encapsuler le rendu de la modale dans un appel `createPortal(..., document.body)`. Cela permet d'attacher la boîte de dialogue directement à la racine du document HTML, évitant ainsi tout conflit de positionnement ou de découpage (clipping) induit par le conteneur parent fixe et l'effet `backdrop-blur` du Header.
  - **Titres de CV personnalisés par profil (FR & EN + DeepL)** :
    - *Migration SQL* : Ajout des colonnes `title_fr` et `title_en` dans la table `cv_profiles` (fichier de migration `20260727000000_add_cv_profiles_titles.sql`).
    - *Interface Admin* : Ajout de deux champs de texte ("Titre professionnel sur le CV - FR" et "EN") dans la page `/admin/cv-profils`, positionnés sous le nom du profil. Intégration du bouton de traduction automatique DeepL (`✨`) pour traduire instantanément le titre français vers l'anglais.
    - *Moteur PDF (`generate.ts`)* : Le générateur vérifie désormais si un titre sur mesure (`profile.title_fr` ou `profile.title_en`) est défini pour le profil sélectionné. Si c'est le cas, il remplace le titre global du site sur le document généré. Chaque CV public (ex: *Ingénieur Logiciel* vs *RAMS & Électronique*) affiche ainsi son propre titre de poste spécifique !

---
*Dernière mise à jour : Phase 3 achevée (avec ajustements Portal et Titres sur mesure, en attente de validation avant push).*



