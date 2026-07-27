-- Migration: Add custom titles (FR & EN) to cv_profiles for dynamic PDF rendering
ALTER TABLE public.cv_profiles 
ADD COLUMN IF NOT EXISTS title_fr text,
ADD COLUMN IF NOT EXISTS title_en text;
