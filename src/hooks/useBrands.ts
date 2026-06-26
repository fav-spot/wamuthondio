import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  id: string;
  brand_name: string;
  brand_colour: string;
  is_active: boolean;
  is_brand_locked: boolean;
  display_order: number;
}

/**
 * Reads brands from the brands table. By default returns only active.
 */
export function useBrands(opts: { onlyActive?: boolean; onlyLocked?: boolean } = {}) {
  const { onlyActive = true, onlyLocked = false } = opts;
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("brands")
        .select("id, brand_name, brand_colour, is_active, is_brand_locked, display_order")
        .order("display_order", { ascending: true });
      if (onlyActive) q = q.eq("is_active", true);
      if (onlyLocked) q = q.eq("is_brand_locked", true);
      const { data } = await q;
      if (cancel) return;
      setBrands((data as Brand[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [onlyActive, onlyLocked]);

  return { brands, loading };
}
