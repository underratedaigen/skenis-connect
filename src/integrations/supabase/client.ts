import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://ebipulkypaqpxvxtxklo.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaXB1bGt5cGFxcHh2eHR4a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDc1OTIsImV4cCI6MjA5ODMyMzU5Mn0.OJWInvEMwMgQr27cW8xbkBGEHxHyyVPryW0PhZm_HVM";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
