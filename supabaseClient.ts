import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Create a .env.local file and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

/**
 * Are the Supabase credentials provided (not the default placeholder values)?
 * This is a helper for displaying a warning message in the UI.
 */
export const credentialsProvided = supabaseUrl.includes('supabase.co');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);