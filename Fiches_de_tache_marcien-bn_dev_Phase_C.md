marcien-bn.dev — Fiches de tâche (Phase C)
À compléter au fil du projet. Une fiche = une tâche = une session avec l'agent, validée avant de passer à la suivante (boucle de vérification, Méthodologie section Phase C).

---

## Fiche 1 — Setup initial du projet

**Objectif :** Initialiser le projet Next.js avec la stack et la structure de dossiers définies.

**Contexte :** Spec technique section 5 (Structure du projet) et section 6.4 (Dépendances autorisées).

**Entrées :** Aucune (création du projet).

**Sortie attendue :**
- Projet Next.js (App Router, TypeScript strict) initialisé
- Tailwind CSS + shadcn/ui configurés
- Arborescence conforme à la Spec technique section 5 (`/app/(public)`, `/app/(admin)`, `/lib`, `/components`)
- Dépôt Git initialisé, `.gitignore` incluant `.env.local`
- Projet connecté à Vercel (déploiement de la page par défaut réussi)
- Fichier `CLAUDE.md` à la racine contenant le Master Prompt du projet

**Critères d'acceptation :**
- [ ] `npm run dev` fonctionne sans erreur
- [ ] Le déploiement Vercel de la branche principale est accessible publiquement
- [ ] `.env.local` n'apparaît pas dans le premier commit
- [ ] Seules les dépendances listées en Spec technique 6.4 sont présentes dans `package.json`

**Hors périmètre :**
- Aucune connexion à Supabase ou DeepL à ce stade
- Aucune page fonctionnelle au-delà de la page par défaut

**Sécurité :**
- RLS : sans objet (pas encore de base de données)
- Validation serveur : sans objet
- Niveau d'accès requis : public
- Dépendances autorisées : next, react, react-dom, tailwindcss, shadcn/ui

---

## Fiche 2 — Design system (composants de base)

**Objectif :** Construire les composants UI de base réutilisables, en s'appuyant sur une direction artistique claire, technologique et premium.

**Contexte :** PRD section 4.3 (mobile-first, simplicité) ; cahier des charges initial (identité graphique — thème clair, accent bleu/cyan, animations discrètes).

**Entrées :**
- Éventuelle image de référence à joindre pour la direction artistique
- ⚠️ Consigne pour l'agent : s'inspirer du style visuel (couleurs, esprit, mise en page générale) sans reproduire à l'identique un design tiers si une image de référence provient d'un site existant.

**Sortie attendue :**
- Palette de couleurs (thème clair, accent bleu/cyan) et typographie définies dans la config Tailwind
- Composants de base : bouton (primaire/secondaire), champ de formulaire, carte compétence, carte expérience, carte projet (avec badge de statut en_cours/termine), badge de domaine (sûreté de fonctionnement / électronique / automatisme / informatique-IA), header, footer, sélecteur de langue
- Tous les composants responsive, testés visuellement sur largeur mobile (375px) et desktop

**Critères d'acceptation :**
- [ ] Chaque composant s'affiche correctement sur mobile et desktop
- [ ] La palette et la typographie sont centralisées (pas de couleurs "en dur" dans les composants)
- [ ] Une page de démonstration liste tous les composants

**Hors périmètre :**
- Pas de logique métier, pas de données réelles à ce stade — uniquement les composants génériques

**Sécurité :**
- Sans objet (aucune donnée, aucune route)
- Dépendances autorisées : tailwindcss, shadcn/ui, lucide-react

---

## Fiche 3 — Contenu réel du profil (compétences, expériences, formations, projets)

**Objectif :** Structurer, à partir des informations réelles du CV fournies par l'utilisateur, un fichier de données `/lib/data/seed.ts` qui servira à la fois de contenu pour les pages publiques (Fiche 4) et de seed pour la base Supabase (Fiche 5).

**Contexte :** Spec technique section 2 (modèle de données — tables `skills`, `experiences`, `educations`, `projects`, et tables de liaison `*_domains`) ; PRD section 5 (modèle fonctionnel des données).

**Entrées :**
- **Informations du CV fournies ci-dessous par l'utilisateur** (à coller intégralement avant de confier la tâche à l'agent) :
  - Liste des compétences, par catégorie (ex. Sûreté de fonctionnement, Technologies/Systèmes, Informatique, IOT, Langues)
  - Liste des expériences professionnelles (titre, entreprise, lieu, période, description, réalisations)
  - Liste des formations et certifications (titre, établissement, période)
  - Liste des projets, si possible déjà au format "étude de cas" (contexte / démarche / résultat), avec mention des images disponibles pour chaque projet
  - Pour chaque élément : le ou les domaines à associer (sûreté de fonctionnement, électronique, automatisme, informatique/IA)

  > **Contenu réel validé avec l'utilisateur :**
  > ```
  > COMPÉTENCES (par catégorie, domaines associés)
  >
  > Sûreté de fonctionnement [sûreté de fonctionnement] :
  > Analyse fonctionnelle (APTE, SADT, FAST) ; Analyse des risques (AMDEC, APR, FTA) ;
  > Modélisation (RdP, Markov, SysML, UML) ; Analyse de sécurité par les modèles MBSE-MBSA ;
  > Fiabilité prévisionnelle (FIDES, MIL-HDBK217, IEC62380, Item Toolkit, ExperTool) ;
  > Fiabilité opérationnelle (Monte-Carlo, FRACASS, MTBF/MTTR/MTTF) ;
  > Normes CENELEC EN 50126/50128/50129, ISO 26262, ISO 9001
  >
  > Électronique [électronique] :
  > Systèmes embarqués (AOP, FPGA/CPLD, BMS, ESP32) ;
  > Électronique de puissance (moteurs à induction, variateurs, convertisseurs) ;
  > Conception PCB / CAO
  >
  > Informatique [informatique/IA] :
  > C/C++, VHDL, Python, Machine Learning, Excel VBA, HTML/CSS, Java/JavaScript,
  > OpenCV, PyQt5, Next.js, Supabase, Vercel (Vibe Coding)
  >
  > IOT [électronique, informatique/IA] :
  > LoRaWAN, Zigbee, Arduino/Cloud
  >
  > Langues (catégorie sans tag domaine) :
  > Français (courant), Anglais (B2)
  >
  > ---
  >
  > EXPÉRIENCES PROFESSIONNELLES
  >
  > 1. Ingénieur RAMS | Stage de fin d'études — Faiveley Transport, Ville-aux-Dames
  >    Mars-Août 2024 [sûreté de fonctionnement, informatique]
  >    Amélioration des études de fiabilité prévisionnelle sur des équipements électroniques
  >    en tenant compte du retour d'expérience.
  >    - Évaluation de la fiabilité prévisionnelle contractuelle selon MIL-HDBK217 et IEC62380
  >    - Mesure de fiabilité opérationnelle (MTBF, MTTF) et détermination des coefficients de rex
  >    - Réévaluation de la fiabilité prévisionnelle
  >    - Mise en place d'une méthodologie générale d'amélioration des études de fiabilité
  >    - Création d'un outil logiciel de calcul de fiabilité opérationnelle développé en Python
  >    - Mise à jour des études de sécurité sur un BRS conformément aux normes EN 50126/EN 50129
  >
  > 2. Ingénieur Fiabilité | Projet en Entreprise — DGA, Bruz
  >    Octobre 2023-Février 2024 (20 jours) [sûreté de fonctionnement]
  >    Étude de la confiance et de la pertinence des résultats obtenus avec une méthode FIDES
  >    allégée pour définir le profil de vie.
  >    - Calcul de la fiabilité prévisionnelle conformément à FIDES
  >    - Réduction des phases du profil de mission FIDES
  >    - Mise en place d'une méthode générale de réduction des phases
  >
  > 3. Développeur Python | Stage de fin d'études — Yazaki Morocco, Tanger
  >    Mars-Août 2023 [informatique, sûreté de fonctionnement]
  >    - Digitalisation des documents dans les ateliers d'assemblage
  >    - Automatisation du processus de documentation (Python, OpenCV)
  >    - Développement d'une interface logiciel desktop (Agile Scrum, PyQt5, Jira)
  >    (voir aussi le projet détaillé "Détection de contour pour câblage automobile" ci-dessous)
  >
  > 4. Concepteur Électronique | Stage de fin d'année — Media Caris SARL, Tanger
  >    Juillet-Septembre 2022 [électronique]
  >    - Conception et optimisation des cartes électroniques pour applications IOT
  >    - Conception du circuit imprimé (KiCad, Eagle PCB)
  >    - Réalisation de terminaux IOT pour le transfert et la collecte de données via
  >      LoRaWan et Zigbee
  >
  > 5. Stagiaire Maintenance Prédictive – Recherche — Smart Automation Technologies, Tanger
  >    Août-Septembre 2021 [sûreté de fonctionnement, électronique, informatique/IA]
  >    Maintenance prédictive de véhicules lourds (edge computing, machine learning)
  >
  > ---
  >
  > FORMATIONS
  >
  > - Certification System Dependability — SEAM Online / INSA Toulouse — Août-Septembre 2025
  > - Certification Functional Safety and ISO 26262 — Udemy — Mars-Mai 2025
  > - Master 2 Fiabilité et Sûreté de Fonctionnement — Polytech Angers — Août 2023-Août 2024
  > - Cycle d'ingénieur : Génie des Systèmes Électroniques et Automatiques — ENSA Tanger — 2020-2023
  > - Classes Préparatoires Intégrées — ENSA Tanger — 2018-2020
  >
  > ---
  >
  > PROJETS (statut entre parenthèses, format contexte / démarche / résultat)
  >
  > 1. Détection de contour pour câblage automobile (terminé)
  >    [informatique, sûreté de fonctionnement, électronique]
  >    Contexte : Le processus classique de câblage automobile utilisait Excel de façon
  >    manuelle — l'opérateur devait lui-même écrire les informations sur les cavités des
  >    connecteurs, source d'erreurs et sans centralisation des données.
  >    Démarche : Développement d'une application desktop en Python (architecture MVC),
  >    avec détection de contour (circulaire, rectangulaire...) sur image de connecteur,
  >    seuil de détection ajustable, sélection et suppression manuelle de contour possibles,
  >    interface graphique réalisée avec Qt Designer. Participation à la phase avant-projet :
  >    recueil du besoin, analyse fonctionnelle, rédaction des user stories, interaction avec
  >    le Product Backlog, environnement agile (2 sprints réalisés).
  >    Résultat : À partir d'une simple image de connecteur et d'un fichier Excel
  >    d'informations, l'application génère automatiquement une image labellisée indiquant
  >    à l'opérateur quel fil placer sur quelle cavité et de quelle couleur, stockée
  >    directement dans la base de données de l'entreprise.
  >    Images disponibles : connecteur brut (vue cavités numérotées), connecteur labellisé
  >    (avec couleurs et références de fils)
  >
  > 2. Microcontrôleur virtuel sur FPGA (terminé) [électronique]
  >    ENSA Tanger, 2023
  >    Conception en VHDL avec Quartus d'un microcontrôleur virtuel en architecture RISC :
  >    implémentation d'une unité arithmétique et logique (UAL), registres, mémoire, et
  >    définition du jeu d'instructions.
  >    (Pas de description contexte/démarche/résultat détaillée disponible au-delà de cette
  >    description — l'agent ne doit pas inventer de détails supplémentaires)
  >
  > 3. Kleleyu Shop (en cours) [informatique]
  >    Site e-commerce propriétaire (produits physiques et digitaux) développé avec
  >    Next.js, Supabase et Vercel, méthodologie de développement documentée avec agent IA
  >    (PRD, spec technique, fiches de tâche).
  >
  > 4. marcien-bn.dev (en cours) [informatique]
  >    Portfolio CV intelligent, ce site lui-même — générateur de CV multi-profils,
  >    architecture Next.js/Supabase/Vercel, développé avec la même méthodologie
  >    documentée que Kleleyu Shop.
  > ```

- Modèle de données exact des tables `skills`, `experiences`, `educations`, `projects` (Spec technique section 2), à respecter strictement dans la structure du fichier généré

**Sortie attendue :**
- Fichier `/lib/data/seed.ts` exportant des tableaux typés : `skillCategories`, `skills`, `experiences`, `educations`, `projects`, avec pour chaque élément les champs `_fr` remplis à partir des informations fournies (le champ `_en` peut être laissé vide ou identique au `_fr` à ce stade — la traduction automatique sera branchée en Fiche 9bis) et les domaines associés
- Les projets déjà décrits en entrée sous forme problème/démarche/résultat sont répartis dans les champs `context_fr`, `approach_fr`, `result_fr`
- Le statut de chaque projet (`en_cours` / `termine`) est repris tel que fourni par l'utilisateur

**Critères d'acceptation :**
- [ ] Chaque élément du fichier respecte exactement les types de colonnes définis en Spec technique section 2 (mêmes noms de champs, mêmes enums)
- [ ] Aucune information n'est inventée : seules les données fournies par l'utilisateur sont utilisées ; tout champ non fourni est laissé vide plutôt que complété par supposition
- [ ] Chaque compétence, expérience, formation et projet est rattaché à au moins un domaine
- [ ] Le fichier est valide TypeScript et s'importe sans erreur

**Hors périmètre :**
- Traduction anglaise (Fiche 9bis)
- Connexion réelle à Supabase (Fiche 5)
- Mise en page ou affichage (Fiche 4)

**Sécurité :**
- Sans objet à ce stade (fichier local, aucune route, aucune donnée sensible)

---

## Fiche 4 — Pages publiques (données réelles)

**Objectif :** Construire les pages publiques du site à partir du contenu réel structuré en Fiche 3.

**Contexte :** PRD section 6.1 (module présentation) ; Spec technique section 5 (arborescence).

**Entrées :**
- Composants du design system (Fiche 2)
- Fichier `/lib/data/seed.ts` (Fiche 3)

**Sortie attendue :**
- Pages `/app/(public)/page.tsx` (accueil), `/a-propos/page.tsx`, `/competences/page.tsx`, `/experiences/page.tsx`, `/projets/page.tsx` (liste + filtres par domaine), `/projets/[slug]/page.tsx` (fiche projet), `/contact/page.tsx` (visuel uniquement)
- Toutes les pages utilisent les données réelles de `/lib/data/seed.ts`, aucune donnée fictive
- Filtres par domaine fonctionnels côté client sur la page Projets

**Critères d'acceptation :**
- [ ] Chaque page s'affiche correctement sur mobile et desktop
- [ ] Le contenu affiché correspond exactement aux informations fournies en Fiche 3 (aucune donnée inventée ou approximée)
- [ ] Les filtres par domaine se combinent correctement
- [ ] Aucun appel réseau vers Supabase à ce stade

**Hors périmètre :**
- Connexion réelle à Supabase
- Sélecteur de langue fonctionnel (le contenu anglais n'existe pas encore)
- Formulaire de contact fonctionnel (visuel uniquement)

**Sécurité :**
- Niveau d'accès requis : public

---

## Fiche 5 — Schéma Supabase réel

**Objectif :** Créer le schéma de base de données Supabase conformément à la Spec technique.

**Contexte :** Spec technique section 2 (schéma SQL complet) et section 3 (politique RLS).

**Entrées :** Spec technique sections 2 et 3.

**Sortie attendue :**
- Toutes les tables créées conformément au schéma SQL (section 2)
- RLS activée sur chaque table, policies conformes au tableau section 3
- Migration versionnée dans le dépôt (dossier `/supabase/migrations`)

**Critères d'acceptation :**
- [ ] Chaque table listée en section 2 existe avec les colonnes et types exacts
- [ ] RLS est activée sur 100 % des tables
- [ ] Chaque policy correspond exactement au tableau section 3 (aucune table sans ligne documentée)

**Hors périmètre :**
- Insertion des données réelles (Fiche 7)
- Auth applicative (Fiche 6)

**Sécurité :**
- RLS requis sur : toutes les tables (voir Spec technique section 3)
- Niveau d'accès requis : sans objet (pas encore de route applicative)

---

## Fiche 6 — Authentification admin

**Objectif :** Brancher Supabase Auth pour le compte administrateur unique et protéger les routes `/admin/*`.

**Contexte :** Spec technique section 6.5 (routes protégées) ; section 1 (middleware).

**Entrées :** Schéma Supabase (Fiche 5).

**Sortie attendue :**
- `/middleware.ts` vérifiant la session Supabase et le rôle admin avant d'atteindre `/admin/*`
- Page de connexion admin
- Client Supabase serveur (`/lib/supabase/server.ts`) et navigateur (`/lib/supabase/client.ts`)

**Critères d'acceptation :**
- [ ] Un utilisateur non connecté est redirigé s'il tente d'accéder à `/admin/*`
- [ ] Un utilisateur connecté mais non-admin (cas théorique, un seul compte existe en V1) ne peut pas accéder à `/admin/*`
- [ ] La `service_role` key n'est utilisée que côté serveur

**Hors périmètre :**
- Interface d'administration elle-même (Fiche 8)

**Sécurité :**
- RLS requis sur : `profiles`
- Niveau d'accès requis : admin pour `/admin/*`
- Dépendances autorisées : @supabase/supabase-js, @supabase/ssr

---

## Fiche 7 — Contenu branché en lecture réelle

**Objectif :** Remplacer les données statiques de `/lib/data/seed.ts` par des appels réels à Supabase, après y avoir inséré ces mêmes données comme seed.

**Contexte :** Spec technique section 4 (contrat d'API — `getSkills`, `getExperiences`, `getEducations`, `getProjects`, `getProjectBySlug`).

**Entrées :**
- Fichier `/lib/data/seed.ts` (Fiche 3), à insérer en base via script de seed
- Schéma Supabase (Fiche 5)

**Sortie attendue :**
- Script de seed exécuté (données de la Fiche 3 présentes en base)
- Server Actions `getSkills`, `getExperiences`, `getEducations`, `getProjects`, `getProjectBySlug` implémentées et branchées aux pages de la Fiche 4

**Critères d'acceptation :**
- [ ] Les pages publiques affichent exactement les mêmes informations qu'en Fiche 4, désormais depuis Supabase
- [ ] Seul le contenu `status = 'published'` est visible publiquement
- [ ] Aucune régression visuelle par rapport à la Fiche 4

**Hors périmètre :**
- Interface d'administration (Fiche 8)

**Sécurité :**
- RLS requis sur : `skills`, `experiences`, `educations`, `projects` et tables `*_domains` (lecture publique du contenu publié uniquement)
- Niveau d'accès requis : public

---

## Fiche 8 — Back-office (CRUD contenu)

Cette tâche macro est découpée en sous-fiches distinctes pour respecter le critère "bornée".

### Fiche 8a — Compétences admin (liste + formulaire)

**Objectif :** CRUD complet des compétences depuis le back-office.

**Contexte :** Spec technique section 4 (`admin.updateSkill`), section 2 (table `skills`).

**Sortie attendue :** `/app/(admin)/admin/competences/page.tsx` — liste, ajout, édition, suppression, changement de statut publié/brouillon.

**Critères d'acceptation :**
- [ ] Ajouter/modifier/supprimer une compétence se reflète immédiatement sur le site public
- [ ] Le formulaire est utilisable sur tablette

**Sécurité :** Niveau d'accès requis : admin. Validation serveur (zod) sur tous les champs.

### Fiche 8b — Expériences et formations admin

**Objectif :** CRUD complet des expériences et formations.

**Sortie attendue :** `/app/(admin)/admin/experiences/page.tsx`, `/app/(admin)/admin/formations/page.tsx`.

**Critères d'acceptation :** identiques à 8a, adaptés aux champs propres à chaque table.

**Sécurité :** Niveau d'accès requis : admin.

### Fiche 8c — Projets admin (liste + formulaire + statut)

**Objectif :** CRUD complet des projets, avec bascule rapide de statut en_cours/termine.

**Contexte :** Spec technique section 4 (`admin.updateProject`, `admin.updateProjectStatus`).

**Sortie attendue :** `/app/(admin)/admin/projets/page.tsx` (liste avec filtre par statut), `/app/(admin)/admin/projets/[id]/page.tsx` (formulaire complet incluant contexte/démarche/résultat, gestion des images, domaines associés), bouton de bascule de statut directement depuis la liste.

**Critères d'acceptation :**
- [ ] Le changement de statut en_cours/termine se fait en un clic depuis la liste, sans ouvrir le formulaire complet
- [ ] L'ajout/suppression d'image fonctionne (upload réel vers Supabase Storage)

**Sécurité :** Niveau d'accès requis : admin.

---

## Fiche 9 — Profils de CV et photo active

**Objectif :** Permettre à l'administrateur de gérer les profils de CV (un seul en V1 : "Standard") et de choisir la photo active pour la génération PDF.

**Contexte :** Spec technique section 2 (`cv_profiles`, `cv_profile_items`, `cv_photos`), section 4.

**Sortie attendue :**
- `/app/(admin)/admin/cv-profils/page.tsx` : édition des items inclus dans le profil "Standard"
- `/app/(admin)/admin/photo/page.tsx` : upload de photo(s), sélection de la photo active

**Critères d'acceptation :**
- [ ] Un seul profil "Standard" existe par défaut, pré-rempli avec tout le contenu publié
- [ ] Une seule photo peut être active à la fois (sélection exclusive)

**Hors périmètre :** Création de nouveaux templates de profils (V2).

**Sécurité :** Niveau d'accès requis : admin. RLS requis sur `cv_profiles`, `cv_profile_items`, `cv_photos`.

---

## Fiche 9bis — Traduction automatique (DeepL)

**Objectif :** Intégrer la traduction automatique FR → EN à la sauvegarde de tout contenu, avec suivi de l'état de relecture.

**Contexte :** Spec technique, sections 1, 2 (colonnes `en_auto_generated`) et 4 (`admin.reviewTranslation`).

**Entrées :** Compte DeepL API Free créé, clé `DEEPL_API_KEY` ajoutée aux variables d'environnement Vercel.

**Sortie attendue :**
- Fonction utilitaire `/lib/translate.ts` appelant l'API DeepL
- Chaque Server Action `admin.update*` déclenche la traduction du ou des champs `_fr` modifiés vers `_en`, sauf si le champ `_en` a été modifié manuellement dans la même requête
- `admin.reviewTranslation(itemType, itemId)` marquant `en_auto_generated = false`
- Indicateur visuel dans le back-office signalant un contenu anglais non relu

**Critères d'acceptation :**
- [ ] Une modification d'un champ français déclenche la mise à jour automatique du champ anglais correspondant
- [ ] Une modification manuelle du champ anglais n'est jamais écrasée par une traduction automatique ultérieure du même contenu
- [ ] Le volume de caractères traduits reste cohérent avec la limite gratuite de 500 000/mois (pas d'appel redondant à chaque frappe, uniquement à la sauvegarde)

**Sécurité :**
- `DEEPL_API_KEY` utilisée uniquement côté serveur
- Niveau d'accès requis : admin (déclenchement uniquement via les Server Actions d'administration)
- Dépendances autorisées : deepl-node

---

## Fiche 10 — Génération PDF à la demande

**Objectif :** Générer et servir un CV en PDF (FR ou EN) sans aucun stockage de fichier.

**Contexte :** Spec technique section 1 (flux de génération PDF), section 4 (`GET /api/cv/[profileId]/[lang]`).

**Entrées :** Contenu réel branché (Fiche 7), profils de CV (Fiche 9), traduction (Fiche 9bis).

**Sortie attendue :**
- Template `/lib/pdf/templates/standard.tsx` (@react-pdf/renderer)
- Route Handler `/api/cv/[profileId]/[lang]/route.ts` assemblant les données et retournant le PDF en réponse HTTP
- Bouton de téléchargement sur le site (choix de la langue)

**Critères d'acceptation :**
- [ ] Le PDF est généré et téléchargé en moins de 3 secondes perçues
- [ ] Aucun fichier n'est écrit sur le serveur ni dans Supabase Storage
- [ ] Le contenu du PDF correspond exactement aux données publiées (langue choisie, photo active)

**Hors périmètre :** Templates additionnels (Canada, Doctorat, Freelance — V2).

**Sécurité :** Niveau d'accès requis : public (données publiées uniquement).

---

## Fiche 11 — Formulaire de contact réel

**Objectif :** Rendre fonctionnel le formulaire de contact visuel construit en Fiche 4.

**Contexte :** Spec technique section 4 (`submitContactMessage`), section 6.3 (anti-spam).

**Sortie attendue :**
- Server Action `submitContactMessage` avec validation zod
- Champ honeypot anti-spam
- Envoi de l'email via Resend

**Critères d'acceptation :**
- [ ] Un envoi valide déclenche bien la réception de l'email
- [ ] Une entrée invalide (email malformé, champ vide) est rejetée côté serveur même si le front la laisse passer
- [ ] Un remplissage du champ honeypot bloque silencieusement l'envoi

**Sécurité :** Validation serveur systématique, anti-spam actif, niveau d'accès requis : public.

---

## Fiche 12 — Durcissement sécurité, tests, vérification des quotas gratuits

**Objectif :** Valider l'ensemble du site avant mise en production.

**Contexte :** Spec technique section 6.6 (Checklist sécurité).

**Sortie attendue :**
- Checklist sécurité passée sur l'ensemble des tables et routes
- Tests automatisés minimaux sur les Server Actions sensibles (auth admin, validation contact)
- Vérification du volume de caractères DeepL utilisé et de l'usage Supabase/Vercel par rapport aux limites gratuites

**Critères d'acceptation :**
- [ ] RLS vérifiée sur 100 % des tables
- [ ] Aucun secret exposé côté client
- [ ] Usage projeté sur un mois dans les limites gratuites de Vercel, Supabase, Resend et DeepL

**Sécurité :** Revue complète, dernière étape avant mise en production.
