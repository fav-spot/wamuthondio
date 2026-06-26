import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatKsh } from "../constants";
import { format } from "date-fns";
import { usePageTitle } from "@/hooks/usePageTitle";

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
  payment_status: string | null;
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

const Card = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</div>
    <div className={`text-2xl md:text-3xl font-extrabold mt-2 ${accent}`}>{value}</div>
  </div>
);

const Dashboard = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSales((data as Sale[]) ?? []);
        setLoading(false);
      });
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const todaySales = sales.filter((s) => s.sale_date === today);
  const todayCount = todaySales.length;
  const todayRevenue = todaySales.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
  const todayCash = todaySales.reduce((s, r) => s + Number(r.amount_paid ?? 0), 0);
  const totalOwed = sales.reduce((s, r) => s + Number(r.balance_owed ?? 0), 0);
  const weekSales = sales.filter((s) => s.sale_date && new Date(s.sale_date) >= sevenDaysAgo);
  const weekCount = weekSales.length;

  const brandTally: Record<string, number> = {};
  weekSales.forEach((s) => {
    if (s.brand_given) brandTally[s.brand_given] = (brandTally[s.brand_given] ?? 0) + 1;
  });
  const topBrand = Object.entries(brandTally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const recent = sales.slice(0, 8);
  const balances = sales
    .filter((s) => Number(s.balance_owed ?? 0) > 0)
    .sort((a, b) => Number(b.balance_owed ?? 0) - Number(a.balance_owed ?? 0))
    .slice(0, 5);

  if (loading) return <div className="text-gray-500">Loading dashboard…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card label="Today's Sales" value={String(todayCount)} accent="text-[#E85D04]" />
        <Card label="Today's Revenue" value={formatKsh(todayRevenue)} accent="text-[#0F1F3D]" />
        <Card label="Cash Collected Today" value={formatKsh(todayCash)} accent="text-green-600" />
        <Card label="Total Balances Owed" value={formatKsh(totalOwed)} accent="text-red-600" />
        <Card label="Sales This Week" value={String(weekCount)} accent="text-[#E85D04]" />
        <Card label="Top Brand This Week" value={topBrand} accent="text-[#0F1F3D]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-[#0F1F3D] mb-3">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 pr-2">Customer</th>
                  <th className="py-2 pr-2">Item</th>
                  <th className="py-2 pr-2">Total</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-gray-400">No sales yet.</td></tr>
                )}
                {recent.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-2 whitespace-nowrap">{s.sale_date ?? "—"}</td>
                    <td className="py-2 pr-2">{s.customer_name ?? "—"}</td>
                    <td className="py-2 pr-2">
                      {s.cylinder_size && s.brand_given
                        ? `${s.cylinder_size} ${s.brand_given}`
                        : s.transaction_type ?? "—"}
                    </td>
                    <td className="py-2 pr-2 font-semibold">{formatKsh(s.total_amount)}</td>
                    <td className="py-2"><StatusBadge status={s.payment_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/sales" className="text-sm text-[#E85D04] font-semibold mt-3 inline-block">
            View all sales →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-[#0F1F3D] mb-3">Balances Owed</h2>
          {balances.length === 0 ? (
            <div className="text-sm text-gray-400">No outstanding balances 🎉</div>
          ) : (
            <ul className="space-y-2">
              {balances.map((b) => (
                <li key={b.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <div className="font-semibold text-[#0F1F3D]">{b.customer_name ?? "—"}</div>
                    <div className="text-xs text-gray-500">{b.customer_phone ?? ""}</div>
                  </div>
                  <div className="font-bold text-red-600">{formatKsh(b.balance_owed)}</div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/balances" className="text-sm text-[#E85D04] font-semibold mt-3 inline-block">
            View all balances →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
