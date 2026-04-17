import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const resolvedKey = supabaseServiceRoleKey ?? supabaseAnonKey;

export const supabaseServer = supabaseUrl && resolvedKey ? createClient(supabaseUrl, resolvedKey) : null;
