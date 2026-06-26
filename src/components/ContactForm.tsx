import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState("General");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in your name, phone, and message.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      full_name: fullName.trim(),
      phone: phone.trim(),
      message: message.trim(),
      inquiry_type: inquiryType,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send. Please WhatsApp us instead.");
      return;
    }
    toast.success("Message sent! We will contact you on WhatsApp shortly. 💬");
    setFullName("");
    setPhone("");
    setMessage("");
    setInquiryType("General");
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-primary/15 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 space-y-3">
      <h3 className="font-bold text-secondary text-lg mb-1">Send Us a Quick Message</h3>
      <p className="text-muted-foreground text-xs mb-3">We reply on WhatsApp within minutes during business hours.</p>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Name</label>
        <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Jane Wanjiku" required />
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
        <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0722 446 378" required />
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Inquiry Type</label>
        <select className={inputCls} value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
          <option>General</option>
          <option>Order</option>
          <option>Refill</option>
          <option>Pricing</option>
          <option>Delivery</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message</label>
        <textarea className={inputCls} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" required />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-full hover:bg-[#c94e00] transition-all duration-250 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
