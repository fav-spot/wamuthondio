import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BRANDS, CYLINDER_SIZES, MOVEMENT_TYPES } from "../constants";
import { toast } from "sonner";
import { format } from "date-fns";
import { usePageTitle } from "@/hooks/usePageTitle";

interface StockRow {
  id: string;
  log_date: string | null;
  brand: string | null;
  cylinder_size: string | null;
  quantity_in: number | null;
  quantity_out: number | null;
  current_stock: number | null;
  movement_type: string | null;
  notes: string | null;
  logged_by: string | null;
}

const StockLog = () => {
  usePageTitle("Stock Log — Wamuthondio Gas Admin");
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filterBrand, setFilterBrand] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("stock_log").select("*").order("created_at", { ascending: false });
    setRows((data as StockRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // current stock = latest current_stock per brand+size
  const currentByBrand = useMemo(() => {
    const map: Record<string, number> = {};
    [...rows].reverse().forEach((r) => {
      const key = `${r.brand}|${r.cylinder_size}`;
      map[key] = Number(r.current_stock ?? 0);
    });
    return map;
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (filterBrand !== "All" && r.brand !== filterBrand) return false;
    if (from && r.log_date && r.log_date < from) return false;
    if (to && r.log_date && r.log_date > to) return false;
    return true;
  });

  const inputCls = "px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm";
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Stock Log</h1>
        <button onClick={() => setOpen(true)} className="bg-[#E85D04] text-white text-sm font-semibold px-4 py-2 rounded-full">
          + Log Stock Movement
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(currentByBrand).map(([key, qty]) => {
          const [b, sz] = key.split("|");
          const cls = qty === 0 ? "bg-red-50 text-red-700" : qty < 5 ? "bg-amber-50 text-amber-700" : "bg-white";
          return (
            <div key={key} className={`rounded-xl shadow-sm p-3 ${cls}`}>
              <div className="text-xs text-gray-600">{b} · {sz}</div>
              <div className="text-2xl font-extrabold">{qty}</div>
              {qty === 0 && <div className="text-[10px] uppercase">Out of stock</div>}
              {qty > 0 && qty < 5 && <div className="text-[10px] uppercase">Low stock</div>}
            </div>
          );
        })}
        {Object.keys(currentByBrand).length === 0 && <div className="text-gray-400 col-span-full">Log your first stock movement to see current stock.</div>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-3 flex gap-2 flex-wrap">
        <select className={inputCls} value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
          <option>All</option>{BRANDS.map((b) => <option key={b}>{b}</option>)}
        </select>
        <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>{["Date","Brand","Size","In","Out","Stock","Type","Notes","Logged By"].map((h) => (
              <th key={h} className="px-3 py-2 whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={9} className="text-center py-4 text-gray-400">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={9} className="text-center py-4 text-gray-400">No stock movements.</td></tr>}
            {filtered.map((r, i) => (
              <tr key={r.id} className={i % 2 ? "bg-gray-50/50" : ""}>
                <td className="px-3 py-2">{r.log_date}</td>
                <td className="px-3 py-2">{r.brand}</td>
                <td className="px-3 py-2">{r.cylinder_size}</td>
                <td className="px-3 py-2 text-green-700">{r.quantity_in}</td>
                <td className="px-3 py-2 text-red-700">{r.quantity_out}</td>
                <td className="px-3 py-2 font-semibold">{r.current_stock}</td>
                <td className="px-3 py-2">{r.movement_type}</td>
                <td className="px-3 py-2">{r.notes}</td>
                <td className="px-3 py-2">{r.logged_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <LogModal onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }} currentByBrand={currentByBrand} />}
    </div>
  );
};

const LogModal = ({ onClose, onSaved, currentByBrand }: {
  onClose: () => void; onSaved: () => void;
  currentByBrand: Record<string, number>;
}) => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [brand, setBrand] = useState<string>(BRANDS[0]);
  const [size, setSize] = useState<string>("6kg");
  const [type, setType] = useState<string>("Purchase");
  const [qIn, setQIn] = useState(0);
  const [qOut, setQOut] = useState(0);
  const [notes, setNotes] = useState("");
  const [by, setBy] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const prior = currentByBrand[`${brand}|${size}`] ?? 0;
    const current = prior + Number(qIn) - Number(qOut);
    const { error } = await supabase.from("stock_log").insert({
      log_date: date, brand, cylinder_size: size, movement_type: type,
      quantity_in: qIn, quantity_out: qOut, current_stock: current,
      notes, logged_by: by,
    });
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Stock movement logged");
    onSaved();
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-3">
        <h3 className="font-bold text-[#0F1F3D]">Log Stock Movement</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs">Date</label><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="text-xs">Brand</label>
            <select className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)}>
              {BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div><label className="text-xs">Size</label>
            <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
              {CYLINDER_SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="text-xs">Type</label>
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
              {MOVEMENT_TYPES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div><label className="text-xs">Quantity In</label><input type="number" min={0} className={inputCls} value={qIn} onChange={(e) => setQIn(Number(e.target.value))} /></div>
          <div><label className="text-xs">Quantity Out</label><input type="number" min={0} className={inputCls} value={qOut} onChange={(e) => setQOut(Number(e.target.value))} /></div>
          <div className="col-span-2"><label className="text-xs">Notes</label><textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="col-span-2"><label className="text-xs">Logged By</label><input className={inputCls} value={by} onChange={(e) => setBy(e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-200 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-full bg-[#E85D04] text-white text-sm font-semibold">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default StockLog;
