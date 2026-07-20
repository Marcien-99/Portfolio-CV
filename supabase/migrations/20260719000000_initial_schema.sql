-- Migration initiale : Création du schéma et des politiques RLS
-- Fiche 5 - marcien-bn.dev

-- 1. Rôles applicatifs et Enums
create type user_role as enum ('admin');
create type item_domain as enum ('surete_fonctionnement', 'electronique', 'automatisme', 'informatique_ia');
create type project_status as enum ('en_cours', 'termine');
create type content_status as enum ('draft', 'published');

-- 2. Création des tables
-- Profil admin (étend auth.users)
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
  en_auto_generated boolean not null default true,
  level int,
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
  end_date date,
  description_fr text,
  description_en text,
  en_auto_generated boolean not null default true,
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
  en_auto_generated boolean not null default true,
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
  context_fr text,
  context_en text,
  approach_fr text,
  approach_en text,
  result_fr text,
  result_en text,
  en_auto_generated boolean not null default true,
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
  name text not null,
  template_key text not null default 'standard',
  is_default boolean not null default false,
  status content_status not null default 'published'
);

create table cv_profile_items (
  id uuid primary key default gen_random_uuid(),
  cv_profile_id uuid not null references cv_profiles(id) on delete cascade,
  item_type text not null check (item_type in ('skill', 'experience', 'education', 'project')),
  item_id uuid not null,
  position int not null default 0
);

create table cv_photos (
  id uuid primary key default gen_random_uuid(),
  file_path text not null,
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
  en_auto_generated boolean not null default true
);

-- 3. Activation de Row Level Security (RLS)
alter table profiles enable row level security;
alter table skill_categories enable row level security;
alter table skills enable row level security;
alter table skill_domains enable row level security;
alter table experiences enable row level security;
alter table experience_domains enable row level security;
alter table educations enable row level security;
alter table projects enable row level security;
alter table project_domains enable row level security;
alter table project_images enable row level security;
alter table cv_profiles enable row level security;
alter table cv_profile_items enable row level security;
alter table cv_photos enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;

-- 4. Politiques de sécurité (Policies)
-- Note: Le rôle "service_role" bypass le RLS par défaut. Ces politiques sécurisent l'accès public (anon key) et l'accès client admin.

-- profils
create policy "Admin lit son propre profil" on profiles for select using (auth.uid() = id);
create policy "Admin modifie son propre profil" on profiles for update using (auth.uid() = id);

-- skill_categories (Public lecture, Admin tout)
create policy "Lecture publique de skill_categories" on skill_categories for select using (true);
create policy "Admin gère skill_categories" on skill_categories using (auth.uid() in (select id from profiles where role = 'admin'));

-- skills (Public lecture si published, Admin tout)
create policy "Lecture publique de skills publiees" on skills for select using (status = 'published');
create policy "Admin gère skills" on skills using (auth.uid() in (select id from profiles where role = 'admin'));

-- skill_domains
create policy "Lecture publique de skill_domains" on skill_domains for select using (
  exists (select 1 from skills where id = skill_id and status = 'published')
);
create policy "Admin gère skill_domains" on skill_domains using (auth.uid() in (select id from profiles where role = 'admin'));

-- experiences
create policy "Lecture publique de experiences publiees" on experiences for select using (status = 'published');
create policy "Admin gère experiences" on experiences using (auth.uid() in (select id from profiles where role = 'admin'));

-- experience_domains
create policy "Lecture publique de experience_domains" on experience_domains for select using (
  exists (select 1 from experiences where id = experience_id and status = 'published')
);
create policy "Admin gère experience_domains" on experience_domains using (auth.uid() in (select id from profiles where role = 'admin'));

-- educations
create policy "Lecture publique de educations publiees" on educations for select using (status = 'published');
create policy "Admin gère educations" on educations using (auth.uid() in (select id from profiles where role = 'admin'));

-- projects
create policy "Lecture publique de projects publies" on projects for select using (visibility = 'published');
create policy "Admin gère projects" on projects using (auth.uid() in (select id from profiles where role = 'admin'));

-- project_domains
create policy "Lecture publique de project_domains" on project_domains for select using (
  exists (select 1 from projects where id = project_id and visibility = 'published')
);
create policy "Admin gère project_domains" on project_domains using (auth.uid() in (select id from profiles where role = 'admin'));

-- project_images
create policy "Lecture publique de project_images" on project_images for select using (
  exists (select 1 from projects where id = project_id and visibility = 'published')
);
create policy "Admin gère project_images" on project_images using (auth.uid() in (select id from profiles where role = 'admin'));

-- cv_profiles
create policy "Lecture publique de cv_profiles publies" on cv_profiles for select using (status = 'published');
create policy "Admin gère cv_profiles" on cv_profiles using (auth.uid() in (select id from profiles where role = 'admin'));

-- cv_profile_items
create policy "Lecture publique de cv_profile_items" on cv_profile_items for select using (
  exists (select 1 from cv_profiles where id = cv_profile_id and status = 'published')
);
create policy "Admin gère cv_profile_items" on cv_profile_items using (auth.uid() in (select id from profiles where role = 'admin'));

-- cv_photos
create policy "Lecture publique de la photo active" on cv_photos for select using (is_active = true);
create policy "Admin gère cv_photos" on cv_photos using (auth.uid() in (select id from profiles where role = 'admin'));

-- contact_messages (Admin seulement pour la lecture. L'insertion se fait côté serveur via service_role, donc aucune policy publique requise).
create policy "Admin gère contact_messages" on contact_messages using (auth.uid() in (select id from profiles where role = 'admin'));

-- site_settings
create policy "Lecture publique des site_settings" on site_settings for select using (true);
create policy "Admin gère site_settings" on site_settings using (auth.uid() in (select id from profiles where role = 'admin'));
