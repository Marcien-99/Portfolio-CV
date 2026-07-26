-- Migration: Add custom bio, show_github, is_public, and skills_order to cv_profiles
ALTER TABLE public.cv_profiles 
ADD COLUMN IF NOT EXISTS bio_fr text,
ADD COLUMN IF NOT EXISTS bio_en text,
ADD COLUMN IF NOT EXISTS show_github boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS skills_order text[];
