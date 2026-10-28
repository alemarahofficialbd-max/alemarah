import { createClient } from '@supabase/supabase-js';

// IMPORTANT: this file ships to every visitor's browser. Only the `anon`
// key belongs here — it is the key RLS policies are meant to constrain.
// The `service_role` key bypasses RLS entirely and must NEVER be loaded
// client-side; it was removed from here because it had been hardcoded
// and shipped in the production bundle. If you still have the old key,
// rotate it in the Supabase dashboard (Project Settings -> API) now.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlsvuljssxuwewrsfhue.supabase.co';
// New-format Supabase "publishable" key (replaces the old anon JWT key).
// Safe to ship to the browser — same trust level as the old anon key, just
// individually revocable from the dashboard without rotating the whole JWT secret.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_AeDYhcqcQF1QJq7fpsAIWw_7hQW0G_a';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    const { data, error } = await supabase.storage
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
