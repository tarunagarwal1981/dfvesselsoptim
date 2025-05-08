import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://aegejyftralxyklrinyn.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ2VqeWZ0cmFseHlrbHJpbnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4OTE1NDEsImV4cCI6MjA1MTQ2NzU0MX0.yCKBqu3Ul16RtXffk7zj9Fa4w1q0IeUg482pVfb93mI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
