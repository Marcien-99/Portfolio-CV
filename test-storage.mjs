import { readFileSync } from 'fs';
const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

async function checkStorage() {
  const res = await fetch(SUPABASE_URL + '/storage/v1/object/list/portfolio', {
    method: 'POST',
    headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix: '', limit: 100 })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
checkStorage();
