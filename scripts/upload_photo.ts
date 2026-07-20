import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Polyfill WebSocket
import WebSocket from 'ws';
Object.assign(globalThis, { WebSocket });

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Clés manquantes.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadPhoto() {
  const bucketName = 'profile-photos';
  
  // 1. Check if bucket exists, if not create it
  const { data: buckets, error: getBucketsErr } = await supabase.storage.listBuckets();
  if (getBucketsErr) {
    console.error("Erreur récupération buckets:", getBucketsErr);
    process.exit(1);
  }
  
  let bucketExists = buckets.some(b => b.name === bucketName);
  
  if (!bucketExists) {
    console.log(`Création du bucket ${bucketName}...`);
    const { error: createErr } = await supabase.storage.createBucket(bucketName, {
      public: true, // Le bucket doit être public pour l'affichage web
      fileSizeLimit: 10485760 // 10MB
    });
    if (createErr) {
      console.error("Erreur création bucket:", createErr);
      process.exit(1);
    }
  }

  // 2. Upload file
  const filePath = path.join(projectDir, 'public', 'Profil.jpg');
  if (!fs.existsSync(filePath)) {
    console.error("Fichier Profil.jpg introuvable dans /public");
    process.exit(1);
  }

  console.log("Upload de la photo...");
  const fileBuffer = fs.readFileSync(filePath);
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from(bucketName)
    .upload('Profil.jpg', fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });
    
  if (uploadErr) {
    console.error("Erreur upload photo:", uploadErr);
    process.exit(1);
  }
  console.log("Photo uploadée:", uploadData.path);

  // 3. Récupérer l'URL publique
  const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl('Profil.jpg');

  // 4. Insérer dans la table cv_photos
  console.log("Insertion en base...");
  // On désactive d'abord toutes les autres
  await supabase.from('cv_photos').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000'); // hacky way to update all
  
  const { error: insertErr } = await supabase.from('cv_photos').insert({
    file_path: publicUrl,
    is_active: true
  });

  if (insertErr) {
    console.error("Erreur insertion cv_photos:", insertErr);
    process.exit(1);
  }

  console.log("✅ Succès !");
}

uploadPhoto();
