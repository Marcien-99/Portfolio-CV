-- Script SQL pour nettoyer les éléments "fantômes" de la table cv_profile_items
-- A exécuter dans l'éditeur SQL de Supabase (SQL Editor)

-- 1. Nettoyer les projets fantômes
DELETE FROM cv_profile_items
WHERE item_type = 'project' AND item_id NOT IN (SELECT id FROM projects);

-- 2. Nettoyer les compétences fantômes
DELETE FROM cv_profile_items
WHERE item_type = 'skill' AND item_id NOT IN (SELECT id FROM skills);

-- 3. Nettoyer les expériences fantômes
DELETE FROM cv_profile_items
WHERE item_type = 'experience' AND item_id NOT IN (SELECT id FROM experiences);

-- 4. Nettoyer les formations fantômes
DELETE FROM cv_profile_items
WHERE item_type = 'education' AND item_id NOT IN (SELECT id FROM educations);

-- Optionnel : Afficher le nombre d'éléments supprimés dans chaque catégorie n'est pas possible directement avec un DELETE simple, 
-- mais si Supabase affiche "Success. X rows affected", ce sera le total des suppressions.
