-- Ajout de la colonne projects_before_experiences à la table cv_profiles
ALTER TABLE public.cv_profiles 
ADD COLUMN IF NOT EXISTS projects_before_experiences boolean NOT NULL DEFAULT false;
