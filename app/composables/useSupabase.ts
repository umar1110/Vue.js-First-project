// composables/useSupabase.ts
import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export const useSupabase = () => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabasekey;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or Key is missing in runtimeConfig");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // Set to true if handling OAuth redirects
    },
  });

  return supabase;
};