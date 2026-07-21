-- Script de migration des Domaines (D'un ENUM vers une Table)
-- ATTENTION: Cette migration est complexe car elle modifie la structure de base.

-- 1. Création de la table des domaines
CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL, -- ex: 'surete_fonctionnement'
  label_fr text NOT NULL,
  label_en text NOT NULL,
  color text,
  icon_name text,
  position int DEFAULT 0
);

-- 2. Insertion des domaines existants
INSERT INTO domains (key, label_fr, label_en, color, icon_name, position) VALUES
('surete_fonctionnement', 'Sûreté de fonctionnement', 'Dependability', 'bg-black text-white', 'ShieldAlert', 1),
('electronique', 'Électronique', 'Electronics', 'bg-blue-50 text-blue-700', 'Cpu', 2),
('automatisme', 'Automatisme', 'Automation', 'bg-orange-50 text-orange-700', 'Settings2', 3),
('informatique_ia', 'Informatique & IA', 'Computer Science & AI', 'bg-purple-50 text-purple-700', 'Code2', 4);

-- 3. Migration (Exemple pour les projets)
-- (Vous devriez créer une nouvelle table de liaison project_domains_new, migrer les données, puis remplacer l'ancienne table).
