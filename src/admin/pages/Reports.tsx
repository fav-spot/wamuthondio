import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatKsh } from "../constants";
import { format, startOfWeek, startOfMonth, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Sale {
  id: string;
  sale_date: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  brand_given: string | null;
  total_amount: number | null;
  amount_paid: number | null;
  balance_owed: number | null;
  payment_method: string | null;
}

const COLORS = ["#E85D04", "#0F1F3D", "#FFB703", "#25D366", "#9C27B0"];

const Reports = () => {
  usePageTitle("Reports — Wamuthondio Gas Admin");
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<"today"|"week"|"month"|"custom">("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    supabase.from("sales").select("id,sale_date,customer_name,customer_phone,brand_given,total_amount,amount_paid,balance_owed,payment_method")
      .then(({ data }) => { setSales((data as Sale[]) ?? []); setLoading(false); });
  }, []);

  const range = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (preset === "today") return { from: today, to: today };
    if (preset === "week") return { from: format(startOfWeek(new Date()), "yyyy-MM-dd"), to: today };
    if (preset === "month") return { from: format(startOfMonth(new Date()), "yyyy-MM-dd"), to: today };
    return { from, to };
  }, [preset, from, to]);

  const filtered = sales.filter((s) => {
    if (!s.sale_date) return false;
    if (range.from && s.sale_date < range.from) return false;
    if (range.to && s.sale_date > range.to) return false;
    return true;
  });

  const totalCount = filtered.length;
  const totalRev = filtered.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
  const totalCash = filtered.reduce((s, r) => s + Number(r.amount_paid ?? 0), 0);
  const totalOwed = filtered.reduce((s, r) => s + Number(r.balance_owed ?? 0), 0);
  const avg = totalCount ? totalRev / totalCount : 0;

  const dailyMap: Record<string, number> = {};
  filtered.forEach((s) => {
    if (s.sale_date) dailyMap[s.sale_date] = (dailyMap[s.sale_date] ?? 0) + Number(s.total_amount ?? 0);
  });
  const dailyData = Object.entries(dailyMap).sort(([a],[b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date: format(parseISO(date), "MMM d"), revenue }));

  const cashVsMpesa: Record<string, number> = {};
  filtered.forEach((s) => {
    const k = s.payment_method ?? "Other";
    cashVsMpesa[k] = (cashVsMpesa[k] ?? 0) + Number(s.amount_paid ?? 0);
  });
  const pieData = Object.entries(cashVsMpesa).map(([name, value]) => ({ name, value }));

  const brandTally: Record<string, number> = {};
  filtered.forEach((s) => { if (s.brand_given) brandTally[s.brand_given] = (brandTally[s.brand_given] ?? 0) + 1; });
  const topBrands = Object.entries(brandTally).sort((a,b) => b[1]-a[1]).slice(0,5);

  const customerTally: Record<string, { name: string; spend: number }> = {};
  filtered.forEach((s) => {
    if (!s.customer_phone) return;
    const cur = customerTally[s.customer_phone] ?? { name: s.customer_name ?? "—", spend: 0 };
    cur.spend += Number(s.total_amount ?? 0);
    if (s.customer_name) cur.name = s.customer_name;
    customerTally[s.customer_phone] = cur;
  });
  const topCustomers = Object.entries(customerTally).sort((a,b) => b[1].spend-a[1].spend).slice(0,5);

  const exportCsv = () => {
    const headers = ["Date","Customer","Phone","Brand","Total","Paid","Balance","Method"];
    const rows = filtered.map((s) => [s.sale_date,s.customer_name,s.customer_phone,s.brand_given,s.total_amount,s.amount_paid,s.balance_owed,s.payment_method]
      .map((v) => `"${(v ?? "").toString().replace(/"/g,'""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `report-${range.from}-to-${range.to}.csv`;
    a.click();
  };

  if (loading) return <div className="text-gray-500">Loading reports…</div>;

  const inputCls = "px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm";
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Reports</h1>
        <button onClick={exportCsv} className="bg-[#0F1F3D] text-white text-sm font-semibold px-4 py-2 rounded-full">Download Report as CSV</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-3 flex gap-2 flex-wrap">
        {(["today","week","month","custom"] as const).map((p) => (
          <button key={p} onClick={() => setPreset(p)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${preset===p?"bg-[#E85D04] text-white":"bg-gray-100"}`}>
            {p === "today" ? "Today" : p === "week" ? "This Week" : p === "month" ? "This Month" : "Custom"}
          </button>
        ))}
        {preset === "custom" && (
          <>
            <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ["Total Sales", String(totalCount), "text-[#E85D04]"],
          ["Total Revenue", formatKsh(totalRev), "text-[#0F1F3D]"],
          ["Cash Collected", formatKsh(totalCash), "text-green-600"],
          ["Balances Outstanding", formatKsh(totalOwed), "text-red-600"],
          ["Average Sale", formatKsh(avg), "text-[#0F1F3D]"],
        ].map(([l, v, c]) => (
          <div key={l} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-[11px] uppercase text-gray-500 font-semibold">{l}</div>
            <div className={`text-xl font-extrabold mt-1 ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-[#0F1F3D] mb-3">Daily Revenue</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#E85D04" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-[#0F1F3D] mb-3">Cash vs M-Pesa</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-[#0F1F3D] mb-3">Top 5 Brands</h3>
          <ol className="space-y-2 text-sm">
            {topBrands.map(([b, c], i) => (
              <li key={b} className="flex justify-between border-b last:border-0 pb-1">
                <span>{i+1}. {b}</span><span className="font-semibold">{c} sold</span>
              </li>
            ))}
            {topBrands.length === 0 && <div className="text-gray-400">No data.</div>}
          </ol>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-[#0F1F3D] mb-3">Top 5 Customers by Spend</h3>
          <ol className="space-y-2 text-sm">
            {topCustomers.map(([phone, c], i) => (
              <li key={phone} className="flex justify-between border-b last:border-0 pb-1">
                <span>{i+1}. {c.name}</span><span className="font-semibold">{formatKsh(c.spend)}</span>
              </li>
            ))}
            {topCustomers.length === 0 && <div className="text-gray-400">No data.</div>}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Reports;
