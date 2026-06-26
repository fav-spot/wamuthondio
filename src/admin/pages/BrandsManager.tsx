import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, GripVertical, Plus, Pencil } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Brand {
  id: string;
  brand_name: string;
  is_active: boolean;
  is_brand_locked: boolean;
  brand_colour: string;
  display_order: number;
}

const BrandsManager = () => {
  usePageTitle("Brands Manager — Wamuthondio Gas Admin");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Brand>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newBrand, setNewBrand] = useState({
    brand_name: "",
    brand_colour: "#E85D04",
    is_brand_locked: false,
  });
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("brands")
      .select("*")
      .order("display_order", { ascending: true });
    setBrands((data as Brand[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (b: Brand) => {
    await supabase.from("brands").update({ is_active: !b.is_active }).eq("id", b.id);
    load();
  };

  const startEdit = (b: Brand) => {
    setEditingId(b.id);
    setEditForm({
      brand_name: b.brand_name,
      brand_colour: b.brand_colour,
      is_brand_locked: b.is_brand_locked,
    });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.brand_name?.trim()) { toast.error("Brand name required"); return; }
    const { error } = await supabase.from("brands").update({
      brand_name: editForm.brand_name.trim(),
      brand_colour: editForm.brand_colour,
      is_brand_locked: editForm.is_brand_locked,
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Brand updated ✅");
    setEditingId(null);
    load();
  };

  const remove = async (b: Brand) => {
    if (!confirm(`Delete "${b.brand_name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("brands").delete().eq("id", b.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Brand deleted");
    load();
  };

  const addBrand = async () => {
    if (!newBrand.brand_name.trim()) { toast.error("Brand name required"); return; }
    const maxOrder = brands.reduce((m, b) => Math.max(m, b.display_order), 0);
    const { error } = await supabase.from("brands").insert({
      brand_name: newBrand.brand_name.trim(),
      brand_colour: newBrand.brand_colour,
      is_brand_locked: newBrand.is_brand_locked,
      display_order: maxOrder + 1,
      is_active: true,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Brand added successfully ✅");
    setShowAdd(false);
    setNewBrand({ brand_name: "", brand_colour: "#E85D04", is_brand_locked: false });
    load();
  };

  const handleDrop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const dragIdx = brands.findIndex((b) => b.id === dragId);
    const targetIdx = brands.findIndex((b) => b.id === targetId);
    const reordered = [...brands];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setBrands(reordered);
    setDragId(null);
    // persist new display_order
    await Promise.all(
      reordered.map((b, i) =>
        supabase.from("brands").update({ display_order: i + 1 }).eq("id", b.id)
      )
    );
    load();
  };

  const lockedBrands = brands.filter((b) => b.is_brand_locked);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Gas Brands We Stock</h1>
          <p className="text-sm text-gray-500">Manage the brands shown on the public website. Changes appear instantly.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#E85D04] hover:bg-[#d35402] text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Brand
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-[#0F1F3D]">Add New Brand</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Brand Name *</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
                value={newBrand.brand_name}
                onChange={(e) => setNewBrand({ ...newBrand, brand_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Brand Colour</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newBrand.brand_colour}
                  onChange={(e) => setNewBrand({ ...newBrand, brand_colour: e.target.value })}
                  className="h-9 w-12 rounded border border-gray-300"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  value={newBrand.brand_colour}
                  onChange={(e) => setNewBrand({ ...newBrand, brand_colour: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newBrand.is_brand_locked}
                  onChange={(e) => setNewBrand({ ...newBrand, is_brand_locked: e.target.checked })}
                />
                Brand-locked
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button onClick={addBrand} className="bg-[#E85D04] text-white px-4 py-2 rounded-full text-sm font-semibold">Save Brand</button>
          </div>
        </div>
      )}

      {/* Section 1 — Brand-locked */}
      <div className="space-y-3">
        <div>
          <h2 className="font-bold text-[#0F1F3D]">⚠️ Brand-Locked Brands</h2>
          <p className="text-xs text-gray-500">These brands appear in the Refilling Guide warning card. They can only be refilled with the same brand.</p>
        </div>
        {loading ? <div className="text-gray-500">Loading…</div> : (
          <div className="grid sm:grid-cols-2 gap-3">
            {lockedBrands.length === 0 && <div className="text-gray-400">No brand-locked brands yet.</div>}
            {lockedBrands.map((b) => (
              <BrandCard
                key={b.id}
                b={b}
                editingId={editingId}
                editForm={editForm}
                setEditForm={setEditForm}
                startEdit={startEdit}
                saveEdit={saveEdit}
                cancelEdit={() => setEditingId(null)}
                toggleActive={toggleActive}
                remove={remove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section 2 — All brands */}
      <div className="space-y-3">
        <div>
          <h2 className="font-bold text-[#0F1F3D]">✅ All Brands We Stock</h2>
          <p className="text-xs text-gray-500">These brands appear in the pill cloud on the public website. Drag the handle to reorder.</p>
        </div>
        {loading ? <div className="text-gray-500">Loading…</div> : (
          <div className="bg-white rounded-2xl shadow-sm divide-y">
            {brands.map((b) => (
              <div
                key={b.id}
                draggable
                onDragStart={() => setDragId(b.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(b.id)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50"
              >
                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab flex-shrink-0" />
                <span className="inline-block w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: b.brand_colour }} />
                {editingId === b.id ? (
                  <div className="flex-1 flex flex-wrap items-center gap-2">
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      value={editForm.brand_name ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, brand_name: e.target.value })}
                    />
                    <input
                      type="color"
                      value={editForm.brand_colour ?? b.brand_colour}
                      onChange={(e) => setEditForm({ ...editForm, brand_colour: e.target.value })}
                      className="h-7 w-9 rounded border border-gray-300"
                    />
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={editForm.is_brand_locked ?? b.is_brand_locked}
                        onChange={(e) => setEditForm({ ...editForm, is_brand_locked: e.target.checked })}
                      />
                      locked
                    </label>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-sm text-[#0F1F3D] flex-1">{b.brand_name}</span>
                    {b.is_brand_locked && (
                      <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">Locked</span>
                    )}
                  </>
                )}
                <label className="flex items-center gap-1 text-xs">
                  <input type="checkbox" checked={b.is_active} onChange={() => toggleActive(b)} />
                  {b.is_active ? "ON" : "OFF"}
                </label>
                {editingId === b.id ? (
                  <>
                    <button onClick={() => saveEdit(b.id)} className="text-xs font-semibold text-[#E85D04]">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-500">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(b)} className="p-1 text-gray-500 hover:text-[#E85D04]"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(b)} className="p-1 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function BrandCard({
  b, editingId, editForm, setEditForm, startEdit, saveEdit, cancelEdit, toggleActive, remove,
}: {
  b: Brand;
  editingId: string | null;
  editForm: Partial<Brand>;
  setEditForm: (f: Partial<Brand>) => void;
  startEdit: (b: Brand) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  toggleActive: (b: Brand) => void;
  remove: (b: Brand) => void;
}) {
  const isEditing = editingId === b.id;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
      <span className="inline-block w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: b.brand_colour }} />
      {isEditing ? (
        <div className="flex-1 flex flex-wrap gap-2">
          <input
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-0"
            value={editForm.brand_name ?? ""}
            onChange={(e) => setEditForm({ ...editForm, brand_name: e.target.value })}
          />
          <input
            type="color"
            value={editForm.brand_colour ?? b.brand_colour}
            onChange={(e) => setEditForm({ ...editForm, brand_colour: e.target.value })}
            className="h-8 w-10 rounded border border-gray-300"
          />
        </div>
      ) : (
        <span className="font-bold text-sm text-[#0F1F3D] flex-1">{b.brand_name}</span>
      )}
      <label className="flex items-center gap-1 text-xs">
        <input type="checkbox" checked={b.is_active} onChange={() => toggleActive(b)} />
        {b.is_active ? "ON" : "OFF"}
      </label>
      {isEditing ? (
        <>
          <button onClick={() => saveEdit(b.id)} className="text-xs font-semibold text-[#E85D04]">Save</button>
          <button onClick={cancelEdit} className="text-xs text-gray-500">Cancel</button>
        </>
      ) : (
        <>
          <button onClick={() => startEdit(b)} className="p-1 text-gray-500 hover:text-[#E85D04]"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => remove(b)} className="p-1 text-red-600"><Trash2 className="h-4 w-4" /></button>
        </>
      )}
    </div>
  );
}

export default BrandsManager;
