import { useMemo } from "react";

import { getSupabaseBrowserClient } from "@/supabase/src/clients/browser-client";
import { Database } from "@/supabase/src/database.types";

export function useSupabase<Db = Database>() {
  return useMemo(() => getSupabaseBrowserClient<Db>(), []);
}
