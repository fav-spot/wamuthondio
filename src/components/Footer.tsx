import flameLogo from "@/assets/flame-logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Refilling Guide", href: "#refilling-guide" },
  { label: "How to Order", href: "#how-to-order" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = Math.max(2027, new Date().getFullYear());
  
  return (
    <footer className="relative border-t-[3px] border-[#FFB703] mb-14 md:mb-0 overflow-hidden" style={{ padding: "48px 6% 28px" }}>
      {/* Immersive Dark Background */}
      <div className="absolute inset-0 bg-[#0F1F3D] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="font-extrabold text-white text-lg mb-3 flex items-center gap-2">
              <img
                src={flameLogo}
                alt="Wamuthondio Gas Supply Logo"
                style={{ height: 32, width: "auto", objectFit: "contain", background: "transparent" }}
                className="drop-shadow-lg"
              />
              <span className="drop-shadow-md">Wamuthondio Cooking Gas</span>
            </p>
            <p className="text-white/70 text-[0.88rem] leading-relaxed">
              Your trusted local gas supplier in Karatina, Nyeri County. Fast delivery, fair prices, all cylinder sizes.
            </p>
          </div>
          <div>
            <p className="font-extrabold text-white mb-3 drop-shadow-md">Quick Links</p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/70 text-sm hover:text-[#FFB703] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-extrabold text-white mb-3 drop-shadow-md">Contact Us</p>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>📞 <a href="tel:+254722446378" className="hover:text-[#FFB703] transition-colors font-bold">0722 446 378</a></li>
              <li>💬 <a href="https://wa.me/254722446378" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB703] transition-colors font-bold">WhatsApp Us</a></li>
              <li>📍 Karatina Town, Nyeri County</li>
              <li>🕐 Mon–Sat 6am–10pm</li>
              <li className="pl-5">Sun 7–10am & 2–10pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[0.82rem] text-white/50">
          <p>© {currentYear} Wamuthondio Cooking Gas Supply · Karatina</p>
          <p>Made with ❤️ for Karatina</p>
        </div>
      </div>
    </footer>
  );
}
