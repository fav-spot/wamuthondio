import { useState, FormEvent, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ACCESSORIES, TRANSACTION_TYPES, CYLINDER_SIZES,
  PAYMENT_METHODS, computePaymentStatus, formatKsh,
} from "../constants";
import { format } from "date-fns";
import { useBrands } from "@/hooks/useBrands";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "../AuthContext";

const LogSale = () => {
  usePageTitle("Log a Sale — Wamuthondio Gas Admin");
  const { fullName, isStaff } = useAuth();
  const { brands } = useBrands({ onlyActive: true });
  const brandNames = brands.map((b) => b.brand_name);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerArea, setCustomerArea] = useState("");
  const [transactionType, setTransactionType] = useState<string>("Refill");
  const [cylinderSize, setCylinderSize] = useState<string>("6kg");
  const [brandGiven, setBrandGiven] = useState<string>("K-Gas");
  const [brandReceived, setBrandReceived] = useState<string>("K-Gas");
  const [itemName, setItemName] = useState<string>("Single Burner");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [mpesaRef, setMpesaRef] = useState("");
  const [saleDate, setSaleDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saleTime, setSaleTime] = useState(format(new Date(), "HH:mm"));
  const [servedBy, setServedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill "Served By" from logged-in user's full_name
  useEffect(() => {
    if (fullName && !servedBy) setServedBy(fullName);
  }, [fullName, servedBy]);

  const handlePhoneChange = async (val: string) => {
    setCustomerPhone(val);
    if (val.length >= 10) {
      const { data } = await supabase
        .from("customers")
        .select("customer_name, customer_area")
        .eq("customer_phone", val)
        .maybeSingle();
      if (data) {
        if (!customerName) setCustomerName(data.customer_name || "");
        if (!customerArea) setCustomerArea(data.customer_area || "");
        toast.info(`Customer found: ${data.customer_name}`);
      }
    }
  };

  const isAccessory = transactionType === "Accessory";
  const showBrandReceived = transactionType === "Refill" || transactionType === "Exchange";
  const totalAmount = useMemo(() => Number(quantity) * Number(unitPrice), [quantity, unitPrice]);
  const balanceOwed = useMemo(() => Math.max(0, totalAmount - Number(amountPaid)), [totalAmount, amountPaid]);
  const paymentStatus = computePaymentStatus(totalAmount, Number(amountPaid));

  const reset = () => {
    setCustomerName(""); setCustomerPhone(""); setCustomerArea("");
    setTransactionType("Refill"); setCylinderSize("6kg");
    setBrandGiven("K-Gas"); setBrandReceived("K-Gas");
    setItemName("Single Burner"); setQuantity(1); setUnitPrice(0);
    setAmountPaid(0); setPaymentMethod("Cash"); setMpesaRef("");
    setSaleDate(format(new Date(), "yyyy-MM-dd"));
    setSaleTime(format(new Date(), "HH:mm"));
    // Keep the served-by field set to the logged-in user
    setServedBy(fullName || ""); setNotes("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Customer name and phone are required");
      return;
    }
    if (unitPrice <= 0) {
      toast.error("Unit price must be greater than 0");
      return;
    }
    setSubmitting(true);

    if (isAccessory) {
      const { error } = await supabase.from("accessories_sales").insert({
        sale_date: saleDate,
        customer_name: customerName,
        customer_phone: customerPhone,
        item_name: itemName,
        quantity, unit_price: unitPrice, total_amount: totalAmount,
        amount_paid: amountPaid, balance_owed: balanceOwed,
        payment_method: paymentMethod,
        mpesa_ref: paymentMethod === "M-Pesa" ? mpesaRef : null,
        payment_status: paymentStatus, notes,
      });
      setSubmitting(false);
      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      const receiptText = `*Wamuthondio Gas Receipt*\nDate: ${saleDate} ${saleTime}\nCustomer: ${customerName}\nItem: ${itemName}\nQty: ${quantity}\nTotal: ${formatKsh(totalAmount)}\nPaid: ${formatKsh(amountPaid)}\nBalance: ${formatKsh(balanceOwed)}\n\nThank you!`;
      const waUrl = `https://wa.me/254${customerPhone.replace(/^0/, "")}?text=${encodeURIComponent(receiptText)}`;
      
      toast.success("Accessory sale recorded ✅", {
        action: { label: "WhatsApp Receipt", onClick: () => window.open(waUrl, "_blank") },
        duration: 10000,
      });
      reset();
      return;
    }

    const { error } = await supabase.from("sales").insert({
      sale_date: saleDate,
      sale_time: saleTime,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_area: customerArea,
      transaction_type: transactionType,
      cylinder_size: cylinderSize,
      brand_given: brandGiven,
      brand_received: showBrandReceived ? brandReceived : null,
      quantity, unit_price: unitPrice, total_amount: totalAmount,
      amount_paid: amountPaid, balance_owed: balanceOwed,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      mpesa_ref: paymentMethod === "M-Pesa" ? mpesaRef : null,
      served_by: servedBy, notes,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    const receiptText = `*Wamuthondio Gas Receipt*\nDate: ${saleDate} ${saleTime}\nCustomer: ${customerName}\nItem: ${transactionType} - ${cylinderSize} ${brandGiven || ''}\nQty: ${quantity}\nTotal: ${formatKsh(totalAmount)}\nPaid: ${formatKsh(amountPaid)}\nBalance: ${formatKsh(balanceOwed)}\n\nThank you!`;
    const waUrl = `https://wa.me/254${customerPhone.replace(/^0/, "")}?text=${encodeURIComponent(receiptText)}`;

    toast.success("Sale recorded successfully ✅", {
      action: { label: "WhatsApp Receipt", onClick: () => window.open(waUrl, "_blank") },
      duration: 10000,
    });
    if (balanceOwed > 0) {
      toast.warning(`Balance of ${formatKsh(balanceOwed)} recorded for ${customerName}.`);
    }
    reset();
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F1F3D]">Record New Sale</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Customer */}
        <section className="space-y-3">
          <h2 className="font-bold text-[#0F1F3D]">Customer Details</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Name *</label>
              <input className={inputCls} value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Phone *</label>
              <input className={inputCls} value={customerPhone} onChange={(e) => handlePhoneChange(e.target.value)} required />
              <div className="text-[11px] text-gray-400 mt-1">Used for WhatsApp receipt</div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Area</label>
              <input className={inputCls} value={customerArea} onChange={(e) => setCustomerArea(e.target.value)} placeholder="e.g. Karatina, Kiamaina, Kagumo" />
            </div>
          </div>
        </section>

        {/* Transaction */}
        <section className="space-y-3">
          <h2 className="font-bold text-[#0F1F3D]">Transaction Details</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Type *</label>
              <select className={inputCls} value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                {TRANSACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {!isAccessory && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-600">Cylinder Size</label>
                  <select className={inputCls} value={cylinderSize} onChange={(e) => setCylinderSize(e.target.value)}>
                    {CYLINDER_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Brand Given to Customer</label>
                  <select className={inputCls} value={brandGiven} onChange={(e) => setBrandGiven(e.target.value)}>
                    {brandNames.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                {showBrandReceived && (
                  <div>
                    <label className="text-xs font-medium text-gray-600">Brand Received from Customer</label>
                    <select className={inputCls} value={brandReceived} onChange={(e) => setBrandReceived(e.target.value)}>
                      {brandNames.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}
            {isAccessory && (
              <div>
                <label className="text-xs font-medium text-gray-600">Item Name</label>
                <select className={inputCls} value={itemName} onChange={(e) => setItemName(e.target.value)}>
                  {ACCESSORIES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-600">Quantity</label>
              <input type="number" min={1} className={inputCls} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="space-y-3">
          <h2 className="font-bold text-[#0F1F3D]">Payment Details</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Unit Price *</label>
              <input type="number" min={0} className={inputCls} value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} placeholder="Enter today's agreed price" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Total</label>
              <div className="px-3 py-2 rounded-lg bg-orange-50 text-[#E85D04] font-extrabold text-lg">
                {formatKsh(totalAmount)}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Amount Paid Now</label>
              <input type="number" min={0} className={inputCls} value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Balance</label>
              <div className={`px-3 py-2 rounded-lg font-bold ${
                balanceOwed > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
              }`}>
                {balanceOwed > 0 ? formatKsh(balanceOwed) : "✅ Fully Paid"}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Payment Method</label>
              <select className={inputCls} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {paymentMethod === "M-Pesa" && (
              <div>
                <label className="text-xs font-medium text-gray-600">M-Pesa Reference</label>
                <input className={inputCls} value={mpesaRef} onChange={(e) => setMpesaRef(e.target.value)} placeholder="e.g. QA12BX7890" />
              </div>
            )}
            <div className="md:col-span-3 text-sm text-gray-600">
              Status: <span className="font-semibold">{paymentStatus}</span>
            </div>
          </div>
        </section>

        {/* Additional */}
        <section className="space-y-3">
          <h2 className="font-bold text-[#0F1F3D]">Additional Info</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Date</label>
              <input type="date" className={inputCls} value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Time</label>
              <input type="time" className={inputCls} value={saleTime} onChange={(e) => setSaleTime(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Served By</label>
              <input
                className={`${inputCls} ${isStaff ? "bg-gray-100 cursor-not-allowed" : ""}`}
                value={servedBy}
                onChange={(e) => setServedBy(e.target.value)}
                placeholder="Staff name"
                readOnly={isStaff}
                disabled={isStaff}
                title={isStaff ? "Locked to your account" : undefined}
              />
              {isStaff && (
                <div className="text-[11px] text-gray-400 mt-1">Locked to your account</div>
              )}
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-medium text-gray-600">Notes</label>
              <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Customer collecting tomorrow" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={submitting}
          className="w-full bg-[#E85D04] hover:bg-[#d35402] text-white font-bold py-3 rounded-full transition-colors disabled:opacity-60">
          {submitting ? "Saving…" : "Save Sale Record"}
        </button>
      </form>
    </div>
  );
};

export default LogSale;
