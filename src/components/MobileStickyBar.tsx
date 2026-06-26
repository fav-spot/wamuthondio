const WA_ORDER = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20order%20gas.%20Please%20help.";

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[998] md:hidden h-14 flex items-center px-3 gap-2 border-t border-white/10" style={{ background: "#0F1F3D" }}>
      <a
        href="tel:+254722446378"
        className="flex-1 flex items-center justify-center gap-2 border border-white/40 text-white rounded-full h-10 text-sm font-bold hover:bg-white/10 transition"
      >
        📞 Call Us
      </a>
      <a
        href={WA_ORDER}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 bg-whatsapp text-whatsapp-foreground rounded-full h-10 text-sm font-bold wa-btn transition-all duration-250"
      >
        💬 WhatsApp Order
      </a>
    </div>
  );
}
