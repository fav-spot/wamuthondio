import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatKsh, formatPhoneForWhatsApp, daysSince, PAYMENT_METHODS } from "../constants";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "../AuthContext";

interface Sale {
  id: string;
  sale_date: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  cylinder_size: string | null;
  brand_given: string | null;
  transaction_type: string | null;
  total_amount: number | null;
  amount_paid: number | null;
  balance_owed: number | null;
}

const Balances = () => {
  usePageTitle("Balances Owed — Wamuthondio Gas Admin");
  const { isOwner, fullName } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentFor, setPaymentFor] = useState<Sale | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("sales")
      .select("id,sale_date,customer_name,customer_phone,cylinder_size,brand_given,transaction_type,total_amount,amount_paid,balance_owed")
      .gt("balance_owed", 0)
      .order("balance_owed", { ascending: false });
    setSales((data as Sale[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalOwed = sales.reduce((s, r) => s + Number(r.balance_owed ?? 0), 0);

  const markFullyPaid = async (s: Sale) => {
    if (!confirm(`Mark ${s.customer_name} as fully paid? This cannot be undone.`)) return;
    const { error } = await supabase.from("sales").update({
      balance_owed: 0, payment_status: "Paid in Full",
      amount_paid: Number(s.total_amount ?? 0),
    }).eq("id", s.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Marked fully paid ✅");
    load();
  };

  const whatsappReminder = (s: Sale) => {
    if (!s.customer_phone) return;
    const msg =
`Hi ${s.customer_name ?? "there"}, this is a friendly reminder that you have an outstanding balance of ${formatKsh(s.balance_owed)} at Wamuthondio Cooking Gas Supply. Please settle at your earliest convenience. Thank you 🙏 — 0722 446 378`;
    window.open(`https://wa.me/${formatPhoneForWhatsApp(s.customer_phone)}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (loading) return <div className="text-gray-500">Loading balances…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Balances Owed</h1>

      {sales.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-800 text-center font-semibold">
          ✅ All clear — no outstanding balances!
        </div>
      ) : (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 font-semibold">
            {sales.length} customer{sales.length === 1 ? "" : "s"} owe a total of {formatKsh(totalOwed)}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {sales.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-extrabold text-[#0F1F3D] text-lg">{s.customer_name}</div>
                    <a href={`tel:${s.customer_phone}`} className="text-sm text-[#E85D04]">{s.customer_phone}</a>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="text-2xl font-extrabold text-red-600">{formatKsh(s.balance_owed)}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  {s.cylinder_size ?? ""} {s.brand_given ?? ""} {s.transaction_type ?? ""}
                </div>
                <div className="text-xs text-gray-500">
                  {s.sale_date} · {daysSince(s.sale_date)} day{daysSince(s.sale_date) === 1 ? "" : "s"} ago<br />
                  Total: {formatKsh(s.total_amount)} · Paid: {formatKsh(s.amount_paid)}
                </div>
                <div className="flex gap-2 flex-wrap pt-2">
                  <a href={`tel:${s.customer_phone}`} className="px-3 py-1.5 text-xs rounded-full bg-[#0F1F3D] text-white">📞 Call</a>
                  <button onClick={() => whatsappReminder(s)} className="px-3 py-1.5 text-xs rounded-full bg-[#25D366] text-white">💬 WhatsApp Reminder</button>
                  <button onClick={() => setPaymentFor(s)} className="px-3 py-1.5 text-xs rounded-full bg-[#E85D04] text-white">💵 Record Payment</button>
                  {isOwner && (
                    <button onClick={() => markFullyPaid(s)} className="px-3 py-1.5 text-xs rounded-full bg-green-600 text-white">✅ Mark Fully Paid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {paymentFor && (
        <RecordPaymentModal
          sale={paymentFor}
          defaultReceivedBy={fullName}
          onClose={() => setPaymentFor(null)}
          onSaved={() => { setPaymentFor(null); load(); }}
        />
      )}
    </div>
  );
};

const RecordPaymentModal = ({ sale, defaultReceivedBy = "", onClose, onSaved }: { sale: Sale; defaultReceivedBy?: string; onClose: () => void; onSaved: () => void }) => {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("Cash");
  const [mpesaRef, setMpesaRef] = useState("");
  const [receivedBy, setReceivedBy] = useState(defaultReceivedBy);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (amount <= 0) { toast.error("Enter an amount"); return; }
    setSaving(true);
    const newPaid = Number(sale.amount_paid ?? 0) + amount;
    const newBalance = Math.max(0, Number(sale.total_amount ?? 0) - newPaid);
    const newStatus = newBalance === 0 ? "Paid in Full" : "Partial";

    const { error: payErr } = await supabase.from("balance_payments").insert({
      sale_id: sale.id, customer_phone: sale.customer_phone,
      amount_paid: amount, payment_method: method,
      mpesa_ref: method === "M-Pesa" ? mpesaRef : null,
      remaining_balance: newBalance, received_by: receivedBy, notes,
    });
    if (payErr) { setSaving(false); toast.error("Failed to record payment"); return; }

    const { error: saleErr } = await supabase.from("sales")
      .update({ amount_paid: newPaid, balance_owed: newBalance, payment_status: newStatus })
      .eq("id", sale.id);
    setSaving(false);
    if (saleErr) { toast.error("Failed to update sale"); return; }
    toast.success(`Payment of ${formatKsh(amount)} recorded ✅`);
    onSaved();
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
        <h3 className="font-bold text-[#0F1F3D]">Record Payment for {sale.customer_name}</h3>
        <div className="text-xs text-gray-500">Outstanding: {formatKsh(sale.balance_owed)}</div>
        <div>
          <label className="text-xs font-medium text-gray-600">Amount Paying Now</label>
          <input type="number" min={0} className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Payment Method</label>
          <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAYMENT_METHODS.filter((m) => m !== "Credit").map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        {method === "M-Pesa" && (
          <div>
            <label className="text-xs font-medium text-gray-600">M-Pesa Ref</label>
            <input className={inputCls} value={mpesaRef} onChange={(e) => setMpesaRef(e.target.value)} />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-gray-600">Received By</label>
          <input className={inputCls} value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Notes</label>
          <input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-200 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-full bg-[#E85D04] text-white text-sm font-semibold">
            {saving ? "Saving…" : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balances;
