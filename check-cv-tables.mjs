import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: profiles, error: err1 } = await supabase.from('cv_profiles').select('*').limit(1);
  console.log('cv_profiles:', err1 ? err1.message : 'Exists');
  
  const { data: photos, error: err2 } = await supabase.from('cv_photos').select('*').limit(1);
  console.log('cv_photos:', err2 ? err2.message : 'Exists');
}
check();
