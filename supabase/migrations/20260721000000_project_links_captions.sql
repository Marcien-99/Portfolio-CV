-- 1. Création de la table pour les liens
create table project_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  label_fr text,
  label_en text,
  position int not null default 0
);

-- 2. Sécurité RLS pour project_links
alter table project_links enable row level security;

create policy "Lecture publique de project_links" on project_links for select using (
  exists (select 1 from projects where id = project_id and visibility = 'published')
);

create policy "Admin gère project_links" on project_links using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- 3. Ajout des colonnes pour la légende des images
alter table project_images add column if not exists caption_fr text;
alter table project_images add column if not exists caption_en text;
