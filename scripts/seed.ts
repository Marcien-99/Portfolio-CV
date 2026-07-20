import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { skillCategories, skills, experiences, educations, projects } from '../lib/data/seed';

// Polyfill pour Node 20
Object.assign(globalThis, { WebSocket });

// Charger les variables d'environnement (.env.local)
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Les clés Supabase sont manquantes dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🚀 Début du seeding de la base de données...");

  // 1. Catégories de compétences
  console.log("Insertion des catégories de compétences...");
  const { error: errCategories } = await supabase.from('skill_categories').upsert(skillCategories);
  if (errCategories) throw errCategories;

  // 2. Compétences et Domaines
  console.log("Insertion des compétences...");
  for (const skill of skills) {
    const { domains, ...skillData } = skill;
    // Insérer la compétence
    const { error: errSkill } = await supabase.from('skills').upsert(skillData);
    if (errSkill) throw errSkill;

    // Insérer les domaines liés
    if (domains && domains.length > 0) {
      const domainsData = domains.map(d => ({ skill_id: skill.id, domain: d }));
      const { error: errDomains } = await supabase.from('skill_domains').upsert(domainsData);
      if (errDomains) throw errDomains;
    }
  }

  // 3. Expériences et Domaines
  console.log("Insertion des expériences...");
  for (const exp of experiences) {
    const { domains, ...expData } = exp;
    const { error: errExp } = await supabase.from('experiences').upsert(expData);
    if (errExp) throw errExp;

    if (domains && domains.length > 0) {
      const domainsData = domains.map(d => ({ experience_id: exp.id, domain: d }));
      const { error: errDomains } = await supabase.from('experience_domains').upsert(domainsData);
      if (errDomains) throw errDomains;
    }
  }

  // 4. Formations
  console.log("Insertion des formations...");
  for (const edu of educations) {
    const { domains, ...eduData } = edu;
    const { error: errEdu } = await supabase.from('educations').upsert(eduData);
    if (errEdu) throw errEdu;
  }

  // 5. Projets, Domaines et Images
  console.log("Insertion des projets...");
  for (const proj of projects) {
    const { domains, gallery, ...projData } = proj;
    const { error: errProj } = await supabase.from('projects').upsert(projData);
    if (errProj) throw errProj;

    if (domains && domains.length > 0) {
      const domainsData = domains.map(d => ({ project_id: proj.id, domain: d }));
      const { error: errDomains } = await supabase.from('project_domains').upsert(domainsData);
      if (errDomains) throw errDomains;
    }

    if (gallery && gallery.length > 0) {
      const galleryData = gallery.map((img, i) => ({
        project_id: proj.id,
        url: img.src,
        position: i
      }));
      const { error: errGallery } = await supabase.from('project_images').upsert(galleryData);
      if (errGallery) throw errGallery;
    }
  }

  console.log("✅ Seeding terminé avec succès !");
}

seed().catch(err => {
  console.error("❌ Erreur pendant le seeding :", err);
  process.exit(1);
});
