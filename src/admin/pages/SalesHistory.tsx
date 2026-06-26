import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BRANDS, formatKsh, formatPhoneForWhatsApp } from "../constants";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "../AuthContext";

interface Sale {
  id: string;
  sale_date: string | null;
  sale_time: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_area: string | null;
  transaction_type: string | null;
  cylinder_size: string | null;
  brand_given: string | null;
  brand_received: string | null;
  quantity: number | null;
  unit_price: number | null;
  total_amount: number | null;
  amount_paid: number | null;
  balance_owed: number | null;
  payment_status: string | null;
  payment_method: string | null;
  mpesa_ref: string | null;
  receipt_sent: boolean | null;
  served_by: string | null;
  notes: string | null;
  created_at: string;
}

const StatusBadge = ({ status }: { status: string | null }) => {
  const map: Record<string, string> = {
    "Paid in Full": "bg-green-100 text-green-800",
    Partial: "bg-amber-100 text-amber-800",
    Pending: "bg-red-100 text-red-800",
    Credit: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status ?? ""] ?? "bg-gray-100 text-gray-700"}`}>
      {status ?? "—"}
    </span>
  );
};

const buildReceipt = (s: Sale) =>
`🔥 WAMUTHONDIO COOKING GAS SUPPLY
📍 Karatina Town, Nyeri County
📞 0722 446 378
─────────────────────
🧾 Receipt: WGS-${s.id.slice(0, 6).toUpperCase()}
Date: ${s.sale_date ?? ""} ${s.sale_time ?? ""}
Customer: ${s.customer_name ?? ""}
Item: ${s.cylinder_size ?? ""} ${s.brand_given ?? ""} ${s.transaction_type ?? ""}
Qty: ${s.quantity ?? 1}
Total: ${formatKsh(s.total_amount)}
Paid: ${formatKsh(s.amount_paid)}
Balance: ${formatKsh(s.balance_owed)}
Method: ${s.payment_method ?? ""}
${s.mpesa_ref ? `M-Pesa Ref: ${s.mpesa_ref}` : ""}
─────────────────────
Thank you for your business! 🙏
Order again: wa.me/254722446378`;

const SalesHistory = () => {
  usePageTitle("Sales History — Wamuthondio Gas Admin");
  const { isOwner, isStaff, fullName } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [size, setSize] = useState("All");
  const [brand, setBrand] = useState("All");
  const [status, setStatus] = useState("All");
  const [method, setMethod] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Sale | null>(null);

  const load = async () => {
    setLoading(true);
    let query = supabase.from("sales").select("*").order("created_at", { ascending: false });
    // Staff: only see their own sales (matched by served_by = their full_name)
    if (isStaff && fullName) {
      query = query.eq("served_by", fullName);
    }
    const { data } = await query;
    setSales((data as Sale[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [isStaff, fullName]);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      if (from && s.sale_date && s.sale_date < from) return false;
      if (to && s.sale_date && s.sale_date > to) return false;
      if (size !== "All" && s.cylinder_size !== size) return false;
      if (brand !== "All" && s.brand_given !== brand) return false;
      if (status !== "All" && s.payment_status !== status) return false;
      if (method !== "All" && s.payment_method !== method) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !(s.customer_name ?? "").toLowerCase().includes(q) &&
          !(s.customer_phone ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [sales, from, to, size, brand, status, method, search]);

  const totalRev = filtered.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
  const totalCash = filtered.reduce((s, r) => s + Number(r.amount_paid ?? 0), 0);
  const totalOwed = filtered.reduce((s, r) => s + Number(r.balance_owed ?? 0), 0);

  const markPaid = async (id: string, name: string) => {
    if (!confirm(`Mark ${name} as paid in full?`)) return;
    const { error } = await supabase.from("sales")
      .update({ balance_owed: 0, payment_status: "Paid in Full" })
      .eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Marked as paid");
    load();
  };

  const sendReceipt = (s: Sale) => {
    if (!s.customer_phone) { toast.error("No phone number"); return; }
    const phone = formatPhoneForWhatsApp(s.customer_phone);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildReceipt(s))}`;
    window.open(url, "_blank");
    supabase.from("sales").update({ receipt_sent: true }).eq("id", s.id).then(() => load());
  };

  const deleteSale = async (id: string) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Deleted");
    load();
  };

  const exportCsv = () => {
    const headers = ["Date","Time","Customer","Phone","Area","Type","Size","Brand Given","Brand Received","Qty","Total","Paid","Balance","Status","Method","M-Pesa Ref","Served By","Notes"];
    const rows = filtered.map((s) => [
      s.sale_date,s.sale_time,s.customer_name,s.customer_phone,s.customer_area,s.transaction_type,
      s.cylinder_size,s.brand_given,s.brand_received,s.quantity,s.total_amount,s.amount_paid,
      s.balance_owed,s.payment_status,s.payment_method,s.mpesa_ref,s.served_by,s.notes,
    ].map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sales-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const inputCls = "px-3 py-2 rounded-lg border border-gray-300 focus:border-[#E85D04] outline-none text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">
          {isStaff ? "My Sales" : "Sales History"}
        </h1>
        {isOwner && (
          <button onClick={exportCsv} className="bg-[#0F1F3D] text-white text-sm font-semibold px-4 py-2 rounded-full">
            Export CSV
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
          <option>All</option><option>6kg</option><option>13kg</option>
        </select>
        <select className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option>All</option>{BRANDS.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option><option>Paid in Full</option><option>Partial</option><option>Pending</option>
        </select>
        <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>All</option><option>Cash</option><option>M-Pesa</option><option>Credit</option>
        </select>
        <input className={inputCls} placeholder="Search name/phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
        Showing {filtered.length} results · Total: <b>{formatKsh(totalRev)}</b> · Collected: <b>{formatKsh(totalCash)}</b> · Owed: <b className="text-red-600">{formatKsh(totalOwed)}</b>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              {["Date","Customer","Phone","Area","Type","Size","Brand Given","Brand Recv","Qty","Total","Paid","Balance","Status","Method","Served By"].map((h) => (
                <th key={h} className="px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={15} className="text-center py-6 text-gray-400">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={15} className="text-center py-6 text-gray-400">No sales match your filters.</td></tr>}
            {filtered.map((s, i) => (
              <React.Fragment key={s.id}>
                <tr
                  className={`cursor-pointer ${i % 2 ? "bg-gray-50/50" : ""} hover:bg-orange-50/40`}
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                  <td className="px-3 py-2 whitespace-nowrap">{s.sale_date}</td>
                  <td className="px-3 py-2">{s.customer_name}</td>
                  <td className="px-3 py-2">{s.customer_phone}</td>
                  <td className="px-3 py-2">{s.customer_area}</td>
                  <td className="px-3 py-2">{s.transaction_type}</td>
                  <td className="px-3 py-2">{s.cylinder_size}</td>
                  <td className="px-3 py-2">{s.brand_given}</td>
                  <td className="px-3 py-2">{s.brand_received}</td>
                  <td className="px-3 py-2">{s.quantity}</td>
                  <td className="px-3 py-2 font-semibold">{formatKsh(s.total_amount)}</td>
                  <td className="px-3 py-2">{formatKsh(s.amount_paid)}</td>
                  <td className={`px-3 py-2 font-semibold ${Number(s.balance_owed) > 0 ? "text-red-600" : ""}`}>{formatKsh(s.balance_owed)}</td>
                  <td className="px-3 py-2"><StatusBadge status={s.payment_status} /></td>
                  <td className="px-3 py-2">{s.payment_method}</td>
                  <td className="px-3 py-2">{s.served_by}</td>
                </tr>
                {expanded === s.id && (
                  <tr className="bg-orange-50/30">
                    <td colSpan={15} className="px-4 py-3">
                      <div className="text-xs text-gray-600 mb-2">
                        Time: {s.sale_time ?? "—"} · M-Pesa: {s.mpesa_ref ?? "—"} · Receipt sent: {s.receipt_sent ? "Yes" : "No"}<br />
                        Notes: {s.notes ?? "—"}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {isOwner && (
                          <button onClick={() => setEditing(s)} className="px-3 py-1.5 text-xs rounded-full bg-[#0F1F3D] text-white">✏️ Edit</button>
                        )}
                        {Number(s.balance_owed) > 0 && (
                          <button onClick={() => markPaid(s.id, s.customer_name ?? "customer")} className="px-3 py-1.5 text-xs rounded-full bg-green-600 text-white">✅ Mark Paid</button>
                        )}
                        <button onClick={() => sendReceipt(s)} className="px-3 py-1.5 text-xs rounded-full bg-[#25D366] text-white">💬 Send Receipt</button>
                        {isOwner && (
                          <button onClick={() => deleteSale(s.id)} className="px-3 py-1.5 text-xs rounded-full bg-red-600 text-white">🗑️ Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditModal sale={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
};

const EditModal = ({ sale, onClose, onSaved }: { sale: Sale; onClose: () => void; onSaved: () => void }) => {
  const [form, setForm] = useState(sale);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const total = Number(form.quantity ?? 1) * Number(form.unit_price ?? 0);
    const balance = Math.max(0, total - Number(form.amount_paid ?? 0));
    const status = balance === 0 && total > 0 ? "Paid in Full" : Number(form.amount_paid) > 0 ? "Partial" : "Pending";
    const { error } = await supabase.from("sales").update({
      customer_name: form.customer_name, customer_phone: form.customer_phone, customer_area: form.customer_area,
      cylinder_size: form.cylinder_size, brand_given: form.brand_given, brand_received: form.brand_received,
      quantity: form.quantity, unit_price: form.unit_price, total_amount: total,
      amount_paid: form.amount_paid, balance_owed: balance, payment_status: status,
      payment_method: form.payment_method, mpesa_ref: form.mpesa_ref, notes: form.notes,
    }).eq("id", sale.id);
    setSaving(false);
    if (error) { toast.error("Update failed"); return; }
    toast.success("Sale updated");
    onSaved();
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-[#0F1F3D] mb-4">Edit Sale</h3>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} value={form.customer_name ?? ""} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Name" />
          <input className={inputCls} value={form.customer_phone ?? ""} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} placeholder="Phone" />
          <input className={inputCls} value={form.customer_area ?? ""} onChange={(e) => setForm({ ...form, customer_area: e.target.value })} placeholder="Area" />
          <input className={inputCls} value={form.brand_given ?? ""} onChange={(e) => setForm({ ...form, brand_given: e.target.value })} placeholder="Brand Given" />
          <input className={inputCls} value={form.brand_received ?? ""} onChange={(e) => setForm({ ...form, brand_received: e.target.value })} placeholder="Brand Received" />
          <input className={inputCls} value={form.cylinder_size ?? ""} onChange={(e) => setForm({ ...form, cylinder_size: e.target.value })} placeholder="Size" />
          <input type="number" className={inputCls} value={form.quantity ?? 1} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} placeholder="Qty" />
          <input type="number" className={inputCls} value={form.unit_price ?? 0} onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })} placeholder="Unit price" />
          <input type="number" className={inputCls} value={form.amount_paid ?? 0} onChange={(e) => setForm({ ...form, amount_paid: Number(e.target.value) })} placeholder="Amount Paid" />
          <input className={inputCls} value={form.payment_method ?? ""} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} placeholder="Method" />
          <input className={inputCls} value={form.mpesa_ref ?? ""} onChange={(e) => setForm({ ...form, mpesa_ref: e.target.value })} placeholder="M-Pesa Ref" />
          <textarea className={inputCls + " col-span-2"} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-200 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-full bg-[#E85D04] text-white text-sm font-semibold">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
