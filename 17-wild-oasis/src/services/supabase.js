import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://jjmzmtsvxxoqzmvzhsha.supabase.co";
const supabaseKey = "sb_publishable_6p9E1lBBCnYABpurl63GeA_D4uHKKEz";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
