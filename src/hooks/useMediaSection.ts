import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MediaItem {
  id: string;
  file_url: string;
  alt_text: string;
  display_order: number;
}

/**
 * Reads active media for a given section from website_media.
 * Falls back to an empty array; consumers should render their static
 * fallback when the returned list is empty.
 */
export function useMediaSection(section: string) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("website_media")
        .select("id, file_url, alt_text, display_order")
        .eq("section", section)
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (cancel) return;
      const cleaned = (data ?? [])
        .filter((d) => !!d.file_url)
        .map((d) => ({
          id: d.id,
          file_url: d.file_url as string,
          alt_text: d.alt_text ?? "",
          display_order: Number(d.display_order ?? 0),
        }));
      setItems(cleaned);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [section]);

  return { items, loading };
}
