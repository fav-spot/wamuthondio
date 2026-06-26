import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatKsh, formatPhoneForWhatsApp } from "../constants";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Sale {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_area: string | null;
  brand_given: string | null;
  total_amount: number | null;
  balance_owed: number | null;
  sale_date: string | null;
  created_at: string;
}

interface Aggregate {
  phone: string;
  name: string;
  area: string;
  totalPurchases: number;
  totalSpent: number;
  outstandingBalance: number;
  lastPurchaseDate: string | null;
  preferredBrand: string;
  loyaltyOfferSent: boolean;
  notes: string;
}

const Customers = () => {
  usePageTitle("Customers — Wamuthondio Gas Admin");
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Record<string, { loyalty_offer_sent: boolean; notes: string | null }>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [historyFor, setHistoryFor] = useState<Aggregate | null>(null);
  const [editNotesFor, setEditNotesFor] = useState<Aggregate | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: salesData }, { data: custData }] = await Promise.all([
      supabase.from("sales").select("id,customer_name,customer_phone,customer_area,brand_given,total_amount,balance_owed,sale_date,created_at"),
      supabase.from("customers").select("customer_phone,loyalty_offer_sent,notes"),
    ]);
    setSales((salesData as Sale[]) ?? []);
    const map: Record<string, { loyalty_offer_sent: boolean; notes: string | null }> = {};
    ((custData as any[]) ?? []).forEach((c) => {
      map[c.customer_phone] = { loyalty_offer_sent: !!c.loyalty_offer_sent, notes: c.notes };
    });
    setCustomers(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const aggregates = useMemo<Aggregate[]>(() => {
    const map = new Map<string, Aggregate>();
    sales.forEach((s) => {
      if (!s.customer_phone) return;
      const cur = map.get(s.customer_phone) ?? {
        phone: s.customer_phone,
        name: s.customer_name ?? "—",
        area: s.customer_area ?? "",
        totalPurchases: 0, totalSpent: 0, outstandingBalance: 0,
        lastPurchaseDate: null,
        preferredBrand: "",
        loyaltyOfferSent: customers[s.customer_phone]?.loyalty_offer_sent ?? false,
        notes: customers[s.customer_phone]?.notes ?? "",
      };
      cur.totalPurchases += 1;
      cur.totalSpent += Number(s.total_amount ?? 0);
      cur.outstandingBalance += Number(s.balance_owed ?? 0);
      if (!cur.lastPurchaseDate || (s.sale_date && s.sale_date > cur.lastPurchaseDate)) {
        cur.lastPurchaseDate = s.sale_date;
      }
      if (s.customer_name && cur.name === "—") cur.name = s.customer_name;
      if (s.customer_area && !cur.area) cur.area = s.customer_area;
      map.set(s.customer_phone, cur);
    });
    // Find preferred brand per customer
    sales.forEach((s) => {
      if (!s.customer_phone || !s.brand_given) return;
      const cur = map.get(s.customer_phone);
      if (!cur) return;
      const tally: Record<string, number> = (cur as any)._tally ?? ((cur as any)._tally = {});
      tally[s.brand_given] = (tally[s.brand_given] ?? 0) + 1;
    });
    map.forEach((c) => {
      const tally: Record<string, number> = (c as any)._tally ?? {};
      c.preferredBrand = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    });
    return Array.from(map.values());
  }, [sales, customers]);

  const filtered = aggregates.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.phone.toLowerCase().includes(q)) return false;
    }
    if (filter === "Frequent Buyers" && c.totalPurchases < 5) return false;
    if (filter === "Has Balance" && c.outstandingBalance <= 0) return false;
    if (filter === "Loyalty Offer Eligible" && !(c.totalPurchases >= 5 && !c.loyaltyOfferSent)) return false;
    return true;
  });

  const upsertCustomer = async (a: Aggregate, patch: Partial<{ loyalty_offer_sent: boolean; notes: string }>) => {
    const { error } = await supabase.from("customers").upsert({
      customer_phone: a.phone,
      customer_name: a.name,
      customer_area: a.area,
      total_purchases: a.totalPurchases,
      total_spent: a.totalSpent,
      outstanding_balance: a.outstandingBalance,
      last_purchase_date: a.lastPurchaseDate,
      preferred_brand: a.preferredBrand,
      is_frequent: a.totalPurchases >= 5,
      ...patch,
    }, { onConflict: "customer_phone" });
    if (error) { toast.error("Failed to update"); return false; }
    return true;
  };

  const markOfferSent = async (a: Aggregate) => {
    const ok = await upsertCustomer(a, { loyalty_offer_sent: true });
    if (ok) { toast.success("Marked as offer sent 🎁"); load(); }
  };

  const saveNotes = async () => {
    if (!editNotesFor) return;
    const ok = await upsertCustomer(editNotesFor, { notes: notesDraft });
    if (ok) { toast.success("Notes saved"); setEditNotesFor(null); load(); }
  };

  const inputCls = "px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm";
  if (loading) return <div className="text-gray-500">Loading customers…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Customers</h1>
      <div className="flex flex-wrap gap-2 bg-white rounded-2xl shadow-sm p-3">
        <input className={`${inputCls} flex-1 min-w-[200px]`} placeholder="Search by name or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={inputCls} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option><option>Frequent Buyers</option><option>Has Balance</option><option>Loyalty Offer Eligible</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.phone} className="bg-white rounded-2xl shadow-sm p-5 space-y-2">
            <div>
              <div className="font-extrabold text-[#0F1F3D]">{c.name}</div>
              <div className="text-xs text-gray-500">{c.area}</div>
              <a href={`tel:${c.phone}`} className="text-sm text-[#E85D04]">{c.phone}</a>
            </div>
            <div className="text-xs text-gray-700 grid grid-cols-2 gap-1">
              <div>Purchases: <b>{c.totalPurchases}</b></div>
              <div>Spent: <b>{formatKsh(c.totalSpent)}</b></div>
              <div>Last: {c.lastPurchaseDate ?? "—"}</div>
              <div className={c.outstandingBalance > 0 ? "text-red-600" : ""}>Balance: <b>{formatKsh(c.outstandingBalance)}</b></div>
              {c.preferredBrand && <div className="col-span-2">Preferred: {c.preferredBrand}</div>}
            </div>
            <div className="flex flex-wrap gap-1">
              {c.totalPurchases >= 5 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">⭐ Frequent</span>}
              {c.totalPurchases >= 5 && !c.loyaltyOfferSent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">🎁 Eligible</span>}
              {c.loyaltyOfferSent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800">✅ Offer Sent</span>}
            </div>
            <div className="flex flex-wrap gap-1 pt-2">
              <button onClick={() => setHistoryFor(c)} className="px-2.5 py-1 text-xs rounded-full bg-[#0F1F3D] text-white">History</button>
              <a href={`https://wa.me/${formatPhoneForWhatsApp(c.phone)}`} target="_blank" rel="noopener" className="px-2.5 py-1 text-xs rounded-full bg-[#25D366] text-white">💬 WhatsApp</a>
              {c.totalPurchases >= 5 && !c.loyaltyOfferSent && (
                <button onClick={() => markOfferSent(c)} className="px-2.5 py-1 text-xs rounded-full bg-purple-600 text-white">🎁 Mark Sent</button>
              )}
              <button onClick={() => { setEditNotesFor(c); setNotesDraft(c.notes ?? ""); }} className="px-2.5 py-1 text-xs rounded-full bg-gray-200">Edit Notes</button>
            </div>
            {c.notes && <div className="text-xs text-gray-500 italic pt-1">📝 {c.notes}</div>}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-gray-400 col-span-full">No customers match.</div>}
      </div>

      {historyFor && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setHistoryFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-[#0F1F3D] mb-3">{historyFor.name} — Purchase History</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-gray-600"><th className="py-1">Date</th><th>Brand</th><th>Total</th><th>Balance</th></tr></thead>
              <tbody>
                {sales.filter((s) => s.customer_phone === historyFor.phone).map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-1">{s.sale_date}</td>
                    <td>{s.brand_given}</td>
                    <td>{formatKsh(s.total_amount)}</td>
                    <td className={Number(s.balance_owed) > 0 ? "text-red-600" : ""}>{formatKsh(s.balance_owed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-3"><button onClick={() => setHistoryFor(null)} className="px-4 py-2 rounded-full bg-gray-200 text-sm">Close</button></div>
          </div>
        </div>
      )}

      {editNotesFor && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditNotesFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h3 className="font-bold text-[#0F1F3D]">Notes for {editNotesFor.name}</h3>
            <textarea className={inputCls + " w-full"} rows={4} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditNotesFor(null)} className="px-4 py-2 rounded-full bg-gray-200 text-sm">Cancel</button>
              <button onClick={saveNotes} className="px-4 py-2 rounded-full bg-[#E85D04] text-white text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
