import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MEDIA_SECTIONS } from "../constants";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Media {
  id: string;
  section: string | null;
  file_url: string | null;
  file_name: string | null;
  alt_text: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

const MediaManager = () => {
  usePageTitle("Media Manager — Wamuthondio Gas Admin");
  const [section, setSection] = useState<string>(MEDIA_SECTIONS[0]);
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("website_media")
      .select("*").eq("section", section).order("display_order", { ascending: true });
    setItems((data as Media[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [section]);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${section.replace(/\s+/g, "-").toLowerCase()}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("website-media").upload(path, file);
    if (upErr) { setUploading(false); toast.error("Upload failed"); return; }
    const { data: pub } = supabase.storage.from("website-media").getPublicUrl(path);
    const maxOrder = items.reduce((m, i) => Math.max(m, Number(i.display_order ?? 0)), 0);
    const { error: insErr } = await supabase.from("website_media").insert({
      section, file_url: pub.publicUrl, file_name: file.name,
      alt_text: file.name.replace(/\.[^.]+$/, ""), is_active: true, display_order: maxOrder + 1,
    });
    setUploading(false);
    if (insErr) { toast.error("Failed to save record"); return; }
    toast.success("Photo uploaded successfully ✅");
    load();
  };

  const toggle = async (m: Media) => {
    await supabase.from("website_media").update({ is_active: !m.is_active }).eq("id", m.id);
    load();
  };

  const updateAlt = async (id: string, alt: string) => {
    await supabase.from("website_media").update({ alt_text: alt }).eq("id", id);
  };

  const move = async (m: Media, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === m.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("website_media").update({ display_order: swap.display_order }).eq("id", m.id),
      supabase.from("website_media").update({ display_order: m.display_order }).eq("id", swap.id),
    ]);
    load();
  };

  const remove = async (m: Media) => {
    if (!confirm(`Delete ${m.file_name}?`)) return;
    if (m.file_url) {
      const path = m.file_url.split("/website-media/")[1];
      if (path) await supabase.storage.from("website-media").remove([path]);
    }
    await supabase.from("website_media").delete().eq("id", m.id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Media Manager</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-900">
        Photos you upload here appear instantly on the live website. No code editing needed.
      </div>

      <div className="flex flex-wrap gap-2 border-b">
        {MEDIA_SECTIONS.map((s) => (
          <button key={s} onClick={() => setSection(s)}
            className={`px-3 py-2 text-sm font-semibold border-b-2 ${
              section === s ? "border-[#E85D04] text-[#E85D04]" : "border-transparent text-gray-500"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="bg-[#E85D04] text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-60">
          <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : `Upload Photo to ${section}`}
        </button>
      </div>

      {loading ? <div className="text-gray-500">Loading…</div> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.length === 0 && <div className="text-gray-400 col-span-full">No photos yet for this section.</div>}
          {items.map((m, idx) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img src={m.file_url ?? ""} alt={m.alt_text ?? ""} className="w-full h-40 object-cover" />
              <div className="p-3 space-y-2">
                <div className="text-xs text-gray-500 truncate">{m.file_name}</div>
                <input
                  defaultValue={m.alt_text ?? ""}
                  onBlur={(e) => updateAlt(m.id, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder="Alt text"
                />
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={!!m.is_active} onChange={() => toggle(m)} />
                    {m.is_active ? "ON" : "OFF"}
                  </label>
                  <div className="flex gap-1">
                    <button disabled={idx === 0} onClick={() => move(m, -1)} className="p-1 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                    <button disabled={idx === items.length - 1} onClick={() => move(m, 1)} className="p-1 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                    <button onClick={() => remove(m)} className="p-1 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
