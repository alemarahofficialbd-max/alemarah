import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlsvuljssxuwewrsfhue.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3Z1bGpzc3h1d2V3cnNmaHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIzODAsImV4cCI6MjEwNzAzODM4MH0.iVEqiTSSi_Bb2tCJnkjX920qcAObhElMPcrBr5Bctto';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3Z1bGpzc3h1d2V3cnNmaHVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ2MjM4MCwiZXhwIjoyMTA3MDM4MzgwfQ.AEYkF4exQigHNoMCKu04xmQxreZWaQXhrFqFWH1_oSQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

/**
 * Uploads applicant CV directly to Supabase Storage 'resumes' bucket
 * and returns the public CDN download/view URL.
 */
export const uploadResumeToStorage = async (file, cleanId) => {
  if (!file) return null;
  try {
    const fileExt = (file.name || 'cv.pdf').split('.').pop();
    const safeName = `cv_${cleanId}_${Date.now()}.${fileExt}`;
    const filePath = `candidates/${safeName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('resumes')
      .upload(filePath, file, {
        contentType: file.type || 'application/pdf',
        upsert: true
      });

    if (error || !data) {
      console.warn('Storage upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
    return urlData?.publicUrl || null;
  } catch (err) {
    console.error('Storage upload exception:', err);
    return null;
  }
};
