import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlsvuljssxuwewrsfhue.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3Z1bGpzc3h1d2V3cnNmaHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIzODAsImV4cCI6MjEwNzAzODM4MH0.iVEqiTSSi_Bb2tCJnkjX920qcAObhElMPcrBr5Bctto';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
