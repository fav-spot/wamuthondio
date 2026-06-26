import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { formatPhoneForWhatsApp } from "../constants";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Inquiry {
  id: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  message: string | null;
  inquiry_type: string | null;
}

const Inquiries = () => {
  usePageTitle("Inquiries — Wamuthondio Gas Admin");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Inquiry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const buildWaLink = (i: Inquiry) => {
    const phone = formatPhoneForWhatsApp(i.phone ?? "");
    const name = i.full_name ?? "there";
    const text = encodeURIComponent(
      `Hi ${name}, thank you for reaching out to Wamuthondio Gas. How can we help?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Customer Inquiries</h1>
        <p className="text-sm text-gray-500">All messages submitted through the public contact form.</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400">No inquiries yet.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Message</th>
                  <th className="text-right px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i, idx) => (
                  <tr key={i.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(i.created_at), "dd MMM yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0F1F3D]">{i.full_name}</td>
                    <td className="px-4 py-3 text-gray-600">{i.phone}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                        {i.inquiry_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-md">{i.message}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={buildWaLink(i)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        <MessageCircle className="h-3 w-3" /> Reply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {items.map((i) => (
              <div key={i.id} className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#0F1F3D]">{i.full_name}</div>
                    <div className="text-xs text-gray-500">{i.phone}</div>
                  </div>
                  <span className="text-[10px] uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{i.inquiry_type}</span>
                </div>
                <p className="text-sm text-gray-700">{i.message}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400">{format(new Date(i.created_at), "dd MMM HH:mm")}</span>
                  <a
                    href={buildWaLink(i)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  >
                    <MessageCircle className="h-3 w-3" /> Reply on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Inquiries;
