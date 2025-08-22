import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

export const useSupabase = () => {
  const config = useRuntimeConfig();

  if (!supabase) {
    supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    );
  }

  return supabase;
};
