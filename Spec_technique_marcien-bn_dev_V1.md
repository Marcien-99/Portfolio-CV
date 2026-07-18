marcien-bn.dev — Spec technique (Phase B)
Version 1.0 • Juillet 2026
Document de référence technique — à consulter par l'agent IA pour chaque tâche de la Phase C

---

## 0. Objectif du document

Ce document est à l'architecture ce que le PRD est au besoin (PRD v1.0, section 8). Il fige les décisions techniques et la politique de sécurité avant le démarrage de toute tâche de développement. Aucune tâche donnée à l'agent IA ne doit s'écarter de ce document sans que celui-ci soit d'abord mis à jour.

---

## 1. Architecture technique détaillée

```
Client (navigateur)
 │
 ▼
Next.js (Vercel)
├─ Route Groups
│   ├─ (public)  → accueil, à propos, compétences, expériences, projets, contact
│   └─ (admin)   → back-office, protégé par middleware
├─ Server Actions / Route Handlers → logique métier, toujours revalidées côté serveur
├─ Middleware → vérification session Supabase + rôle admin avant d'atteindre (admin)
│
▼
Supabase
├─ Postgres + Row Level Security (policy par table, voir section 3)
├─ Supabase Auth (email/password — compte admin unique)
├─ Storage
│   └─ bucket "profile-photos" (public, lecture seule anonyme)
│
▼
Génération PDF (à la demande, aucun fichier stocké)
├─ Route Handler /api/cv/[profileId]/[lang]
├─ Récupère les items du cv_profile demandé (cv_profile_items)
├─ Rend le PDF en mémoire via @react-pdf/renderer
└─ Retourne le fichier en réponse HTTP (Content-Disposition: attachment)

Services complémentaires
├─ Resend (plan gratuit) → email du formulaire de contact
├─ DeepL API Free (500 000 caractères/mois gratuits) → traduction automatique FR → EN
└─ Vercel Analytics (optionnel, plan gratuit) → mesure de fréquentation
```

**Flux — traduction automatique d'un champ modifié :**

1. L'administrateur modifie un champ en français (ex. `description_fr` d'un projet).
2. La Server Action de sauvegarde appelle l'API DeepL avec le nouveau texte français.
3. Le champ `_en` correspondant est mis à jour avec la traduction reçue, et le contenu est marqué `en_auto_generated = true`.
4. Si l'administrateur modifie ensuite manuellement le champ anglais, celui-ci est marqué `en_auto_generated = false` ("relu") et n'est plus jamais écrasé automatiquement tant qu'il n'est pas de nouveau modifié explicitement en anglais.
5. Le contenu reste publié dans les deux langues dès l'étape 3 — la relecture n'est pas bloquante, elle sert uniquement d'indicateur interne pour l'administrateur.

**Flux critique — téléchargement d'un CV :**

1. Le visiteur choisit une langue (FR/EN) et un profil de CV (un seul disponible en V1 : "Standard").
2. Le client appelle `GET /api/cv/[profileId]/[lang]`.
3. Le Route Handler récupère, côté serveur, la liste des items associés au profil (`cv_profile_items`), les données des tables sources (`skills`, `experiences`, `educations`, `projects`) dans la langue demandée, et la photo active (`cv_photos`).
4. Le PDF est généré en mémoire via `@react-pdf/renderer` et renvoyé directement dans la réponse HTTP.
5. Aucune écriture en base, aucun fichier stocké sur le serveur ou dans Supabase Storage.

Ce flux garantit qu'aucun PDF n'existe en dehors de la requête qui le génère — cohérent avec la contrainte de coût nul (pas de stockage additionnel, pas de job asynchrone).

---

## 2. Modèle de base de données (schéma précis)

```sql
-- Rôles applicatifs
create type user_role as enum ('admin');
create type item_domain as enum ('surete_fonctionnement', 'electronique', 'automatisme', 'informatique_ia');
create type project_status as enum ('en_cours', 'termine');
create type content_status as enum ('draft', 'published');

-- Profil admin (étend auth.users) — un seul enregistrement en V1
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'admin',
  created_at timestamptz not null default now()
);

create table skill_categories (
  id uuid primary key default gen_random_uuid(),
  name_fr text not null,
  name_en text not null,
  position int not null default 0
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references skill_categories(id) on delete set null,
  name_fr text not null,
  name_en text not null,
  en_auto_generated boolean not null default true, -- true = traduit par DeepL, non relu manuellement
  level int, -- optionnel, 1 à 5
  status content_status not null default 'draft',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skill_domains (
  skill_id uuid not null references skills(id) on delete cascade,
  domain item_domain not null,
  primary key (skill_id, domain)
);

create table experiences (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  company text not null,
  location text,
  start_date date not null,
  end_date date, -- null = poste actuel
  description_fr text,
  description_en text,
  en_auto_generated boolean not null default true, -- true = traduit par DeepL, non relu manuellement
  status content_status not null default 'draft',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table experience_domains (
  experience_id uuid not null references experiences(id) on delete cascade,
  domain item_domain not null,
  primary key (experience_id, domain)
);

create table educations (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  institution text not null,
  location text,
  start_date date not null,
  end_date date,
  description_fr text,
  description_en text,
  en_auto_generated boolean not null default true, -- true = traduit par DeepL, non relu manuellement
  status content_status not null default 'draft',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  slug text not null unique,
  context_fr text,      -- problème / contexte
  context_en text,
  approach_fr text,     -- démarche
  approach_en text,
  result_fr text,       -- résultat
  result_en text,
  en_auto_generated boolean not null default true, -- true = traduit par DeepL, non relu manuellement
  status project_status not null default 'en_cours',
  visibility content_status not null default 'draft',
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_domains (
  project_id uuid not null references projects(id) on delete cascade,
  domain item_domain not null,
  primary key (project_id, domain)
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  position int not null default 0
);

create table cv_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,         -- "Standard" en V1 ; "Canada", "Doctorat"... en V2
  template_key text not null default 'standard',
  is_default boolean not null default false,
  status content_status not null default 'published'
);

create table cv_profile_items (
  id uuid primary key default gen_random_uuid(),
  cv_profile_id uuid not null references cv_profiles(id) on delete cascade,
  item_type text not null check (item_type in ('skill', 'experience', 'education', 'project')),
  item_id uuid not null, -- référence polymorphe vers skills/experiences/educations/projects
  position int not null default 0
);

create table cv_photos (
  id uuid primary key default gen_random_uuid(),
  file_path text not null, -- chemin dans le bucket public "profile-photos"
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table site_settings (
  key text primary key,
  value_fr text,
  value_en text,
  en_auto_generated boolean not null default true -- true = traduit par DeepL, non relu manuellement
);
```

---

## 3. Politique RLS (table par table)

Règle par défaut de la méthodologie : RLS activé sur toute table. Contrairement à un projet multi-utilisateurs, la règle ici est quasi uniforme : **lecture publique du contenu publié, écriture réservée à l'admin authentifié.**

| Table | RLS activé | Lecture | Écriture |
|---|---|---|---|
| `profiles` | Oui | Admin lit son propre profil | Admin modifie son propre profil |
| `skill_categories` | Oui | Public | Admin uniquement |
| `skills` | Oui | Public si `status = 'published'` ; admin voit tout | Admin uniquement |
| `skill_domains` | Oui | Public (si skill publiée) | Admin uniquement |
| `experiences` | Oui | Public si `status = 'published'` ; admin voit tout | Admin uniquement |
| `experience_domains` | Oui | Public (si expérience publiée) | Admin uniquement |
| `educations` | Oui | Public si `status = 'published'` ; admin voit tout | Admin uniquement |
| `projects` | Oui | Public si `visibility = 'published'` ; admin voit tout | Admin uniquement |
| `project_domains` | Oui | Public (si projet publié) | Admin uniquement |
| `project_images` | Oui | Public (si projet publié) | Admin uniquement |
| `cv_profiles` | Oui | Public si `status = 'published'` ; admin voit tout | Admin uniquement |
| `cv_profile_items` | Oui | Public (via profil publié) | Admin uniquement |
| `cv_photos` | Oui | Public (lecture de la photo `is_active = true` uniquement) ; admin voit toutes | Admin uniquement |
| `contact_messages` | Oui | Personne en lecture directe (transmis par email, pas de dashboard) | Écriture serveur uniquement, après validation zod + anti-spam |
| `site_settings` | Oui | Public | Admin uniquement |

---

## 4. Contrat d'API (Server Actions / Route Handlers)

| Endpoint / Action | Méthode | Accès | Description |
|---|---|---|---|
| `getSkills(domain?)` | Server Action | Public | Liste des compétences publiées, filtre optionnel par domaine |
| `getExperiences(domain?)` | Server Action | Public | Liste des expériences publiées |
| `getEducations()` | Server Action | Public | Liste des formations publiées |
| `getProjects(domain?, status?)` | Server Action | Public | Liste des projets publiés, filtres domaine/statut |
| `getProjectBySlug(slug)` | Server Action | Public | Détail d'un projet publié |
| `getCvProfiles()` | Server Action | Public | Liste des profils de CV disponibles |
| `GET /api/cv/[profileId]/[lang]` | Route Handler | Public | Génère et retourne le PDF du CV demandé |
| `submitContactMessage(name, email, message)` | Server Action | Public, validé serveur + anti-spam | Envoie le message par email (Resend), sans persistance obligatoire |
| `admin.updateSkill(id, data)` | Server Action | Admin uniquement | Édition/création d'une compétence — déclenche la traduction DeepL du champ FR modifié si le champ EN n'a pas été édité manuellement dans la même requête |
| `admin.updateExperience(id, data)` | Server Action | Admin uniquement | Édition/création d'une expérience — même logique de traduction automatique |
| `admin.updateEducation(id, data)` | Server Action | Admin uniquement | Édition/création d'une formation — même logique de traduction automatique |
| `admin.updateProject(id, data)` | Server Action | Admin uniquement | Édition/création d'un projet — même logique de traduction automatique |
| `admin.updateProjectStatus(id, status)` | Server Action | Admin uniquement | Changement rapide en_cours / termine |
| `admin.reviewTranslation(itemType, itemId)` | Server Action | Admin uniquement | Marque le champ anglais comme relu manuellement (`en_auto_generated = false`) |
| `admin.updateCvProfile(id, items)` | Server Action | Admin uniquement | Gestion des items associés à un profil de CV |
| `admin.setActivePhoto(id)` | Server Action | Admin uniquement | Définit la photo active pour la génération PDF |
| `admin.updateSiteSettings(data)` | Server Action | Admin uniquement | Mise à jour des textes globaux |

---

## 5. Structure du projet (arborescence)

```
/app
  /(public)
    /page.tsx                    → accueil
    /a-propos/page.tsx
    /competences/page.tsx
    /experiences/page.tsx
    /projets/page.tsx            → liste + filtres par domaine
    /projets/[slug]/page.tsx     → fiche projet (étude de cas)
    /contact/page.tsx
  /(admin)
    /admin/page.tsx               → dashboard
    /admin/competences/page.tsx
    /admin/experiences/page.tsx
    /admin/formations/page.tsx
    /admin/projets/page.tsx
    /admin/projets/[id]/page.tsx
    /admin/cv-profils/page.tsx
    /admin/photo/page.tsx
    /admin/parametres/page.tsx
  /api
    /cv/[profileId]/[lang]/route.ts   → génération PDF à la volée
    /contact/route.ts                 → envoi email (alternative à Server Action si besoin)
/lib
  /supabase
    client.ts     → client Supabase (anon key, usage navigateur)
    server.ts     → client Supabase (service role, usage serveur uniquement)
  /pdf
    templates/standard.tsx   → template @react-pdf/renderer (V1)
    generate.ts               → logique d'assemblage des données → PDF
  /validations
    contact.schema.ts   → schémas zod
    skill.schema.ts
    experience.schema.ts
    project.schema.ts
  /data
    seed.ts   → données réelles initiales (skills, experiences, projects), utilisées comme mock front-end puis comme seed Supabase
/components
  /ui        → composants shadcn/ui
  /profile   → cartes compétence, expérience, projet
  /admin     → formulaires d'administration
/middleware.ts   → protection des routes (admin)
```

---

## 6. Contraintes de sécurité (à respecter par défaut par l'agent IA)

### 6.1 Gestion des secrets

- Toutes les clés (Supabase service role, Resend, DeepL) sont dans les variables d'environnement Vercel — jamais en dur dans le code.
- La clé `DEEPL_API_KEY` n'est utilisée que côté serveur (dans la Server Action de sauvegarde), jamais exposée au client.
- `.env.local` exclu du dépôt Git dès l'initialisation du projet.
- Seule la clé `NEXT_PUBLIC_SUPABASE_ANON_KEY` (protégée par RLS) est exposée côté client. La `service_role` key n'est jamais utilisée ailleurs que dans du code serveur (`/lib/supabase/server.ts`).
- Aucune clé dans les logs, messages de commit ou fichiers de config versionnés.

### 6.2 Row Level Security

- RLS activé par défaut sur toute nouvelle table (voir tableau section 3, à compléter à chaque ajout de table).
- Toute table créée sans ligne correspondante dans le tableau RLS est bloquante en revue (voir Checklist sécurité).

### 6.3 Validation des entrées

- Chaque Server Action et Route Handler valide ses entrées côté serveur avec un schéma zod dédié (`/lib/validations`), indépendamment de toute validation déjà faite côté formulaire.
- Le formulaire de contact applique en plus une protection anti-spam (champ honeypot minimum ; reCAPTCHA gratuit si le spam devient un problème réel après lancement).
- La validation front sert uniquement au confort utilisateur.

### 6.4 Dépendances autorisées

| Usage | Package |
|---|---|
| Framework | next, react, react-dom |
| Base de données / Auth | @supabase/supabase-js, @supabase/ssr |
| Génération PDF | @react-pdf/renderer |
| Traduction automatique | deepl-node |
| Validation | zod |
| UI | tailwindcss, shadcn/ui, lucide-react |
| Emails | resend |
| Tests | vitest ou jest, @testing-library/react |

Tout ajout de dépendance hors de cette liste doit être explicitement validé avant intégration — l'agent ne doit jamais installer un package qu'il n'a pas vérifié comme existant, maintenu et compatible.

### 6.5 Authentification et autorisation des routes

| Route | Accès |
|---|---|
| `/`, `/a-propos`, `/competences`, `/experiences`, `/projets`, `/projets/[slug]`, `/contact` | Public |
| `/api/cv/[profileId]/[lang]` | Public (données publiées uniquement) |
| `/api/contact` | Public, validé serveur + anti-spam |
| `/admin/*` | Admin uniquement — vérifié par middleware et par RLS en base |

Toute route non listée ici est considérée comme protégée par défaut, jamais comme ouverte.

### 6.6 Checklist sécurité (à valider avant chaque tâche livrée)

| # | Point de contrôle |
|---|---|
| 1 | Aucune clé API, identifiant ou secret en dur dans le code livré |
| 2 | RLS activé et conforme à la policy attendue sur toute table touchée |
| 3 | Toute entrée utilisateur validée côté serveur (zod), indépendamment du front |
| 4 | Aucun nouveau package hors liste autorisée sans validation humaine |
| 5 | Chaque route concernée applique le bon niveau d'authentification/autorisation |
| 6 | Le formulaire de contact reste protégé par la mesure anti-spam définie |

---

## 7. Plan de découpage en tâches (macro)

Approche front-end first : les pages publiques sont construites avec les **données réelles** (via `/lib/data/seed.ts`), pas des données fictives — ce même fichier sert ensuite de seed Supabase.

| # | Tâche macro | Dépend de |
|---|---|---|
| 1 | Setup projet (Next.js, Tailwind, shadcn/ui, dépôt Git, Vercel) | — |
| 2 | Design system (composants de base, palette, typographie) | 1 |
| 3 | Contenu réel structuré (`/lib/data/seed.ts` : compétences, expériences, formations, projets) | — (peut être fait en parallèle) |
| 4 | Pages publiques avec données réelles (accueil, à propos, compétences, expériences, projets + filtres, fiche projet, contact visuel) | 2, 3 |
| 5 | Schéma Supabase réel (tables + RLS, sections 2 et 3) | — (peut être fait en parallèle de 2/4) |
| 6 | Auth Supabase (admin) branchée au middleware | 5 |
| 7 | Contenu branché en lecture réelle depuis Supabase (remplace le seed statique) | 4, 5 |
| 8 | Back-office fonctionnel (CRUD compétences/expériences/formations/projets, changement de statut) | 6, 7 |
| 9 | Gestion des profils de CV et de la photo active (admin) | 8 |
| 9bis | Intégration DeepL : traduction automatique FR → EN à la sauvegarde, flag `en_auto_generated`, action de relecture manuelle | 8 |
| 10 | Génération PDF à la demande (`@react-pdf/renderer`, template standard, FR/EN) | 7, 9, 9bis |
| 11 | Formulaire de contact réel (validation, anti-spam, envoi Resend) | 7 |
| 12 | Durcissement sécurité + tests + vérification des limites des plans gratuits | toutes |

Chaque tâche macro doit être déclinée en une ou plusieurs fiches de tâche avant d'être confiée à l'agent.

---

## 8. Modèle de fiche de tâche (à copier pour chaque tâche confiée à l'agent)

```
### Fiche de tâche — [Titre]

Objectif : [une phrase]

Contexte : [référence à la section du PRD et/ou de cette Spec technique]

Entrées : [fichiers, tables, endpoints déjà existants à utiliser]

Sortie attendue : [fichiers à créer/modifier]

Critères d'acceptation :
- [ ] ...
- [ ] ...

Hors périmètre : [ce que la tâche ne doit PAS faire]

Sécurité :
- RLS requis sur : [table(s) + policy attendue]
- Validation serveur requise sur : [champs]
- Niveau d'accès requis : [public / admin]
- Dépendances autorisées pour cette tâche : [liste, cf. section 6.4]
```

---

## Conclusion

Ce document fige l'architecture, le schéma de données, le contrat d'API et la politique de sécurité de marcien-bn.dev. Il constitue, avec le PRD v1.0, la base documentaire complète à partir de laquelle toute tâche de développement (Phase C) doit être définie. Toute modification de l'architecture ou de la politique de sécurité doit être répercutée ici avant d'être appliquée dans le code.
