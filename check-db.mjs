import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

async function checkImages() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*,project_images(*)`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });
  console.log(JSON.stringify(await res.json(), null, 2));
}

checkImages();
