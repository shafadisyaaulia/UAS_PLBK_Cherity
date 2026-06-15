import { createClient } from '@supabase/supabase-js';

// Ambil dari config/env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Gunakan URL dummy yang valid secara sintaks jika env belum siap saat SSR
const safeUrl = supabaseUrl && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const safeKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl) {
  console.warn("⚠️ Amaran: NEXT_PUBLIC_SUPABASE_URL belum terbaca dengan sempurna.");
}

export const supabase = createClient(safeUrl, safeKey);