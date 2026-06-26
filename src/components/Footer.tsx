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
  return (
    <footer className="border-t-[3px] border-primary mb-14 md:mb-0" style={{ background: "#0F1F3D", padding: "48px 6% 28px" }}>
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="font-extrabold text-white text-lg mb-3 flex items-center gap-2">
              <img
                src={flameLogo}
                alt="Wamuthondio Gas Supply Logo"
                style={{ height: 32, width: "auto", objectFit: "contain", background: "transparent" }}
              />
              <span>Wamuthondio Cooking Gas</span>
            </p>
            <p className="text-white/55 text-[0.88rem] leading-relaxed">
              Your trusted local gas supplier in Karatina, Nyeri County. Fast delivery, fair prices, all cylinder sizes.
            </p>
          </div>
          <div>
            <p className="font-extrabold text-white mb-3">Quick Links</p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/55 text-sm hover:text-accent transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-extrabold text-white mb-3">Contact Us</p>
            <ul className="space-y-2 text-white/55 text-sm">
              <li>📞 <a href="tel:+254722446378" className="hover:text-accent transition-colors">0722 446 378</a></li>
              <li>💬 <a href="https://wa.me/254722446378" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">WhatsApp Us</a></li>
              <li>📍 Karatina Town, Nyeri County</li>
              <li>🕐 Mon–Sat 6am–10pm</li>
              <li className="pl-5">Sun 7–10am & 2–10pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[0.82rem] text-white/35">
          <p>© 2025 Wamuthondio Cooking Gas Supply · Karatina</p>
          <p>Made with ❤️ for Karatina</p>
        </div>
      </div>
    </footer>
  );
}
