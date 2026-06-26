import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import flameLogo from "@/assets/flame-logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Refilling Guide", href: "#refilling-guide" },
  { label: "How to Order", href: "#how-to-order" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const WA_ORDER = "https://wa.me/254722446378?text=Hi%2C%20I%27d%20like%20to%20order%20gas%20from%20Wamuthondio%21%20Please%20help%20me.";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-[10px] border-b-2 border-primary transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.3)]" : ""
      }`}
      style={{ background: "rgba(15,31,61,0.95)", height: 68 }}
    >
      <div className="container mx-auto flex items-center justify-between h-[68px] px-4">
        <a href="#home" className="flex items-center gap-2.5 group">
          <img
            src={flameLogo}
            alt="Wamuthondio Gas Supply Logo"
            style={{ height: 36, width: "auto", objectFit: "contain", background: "transparent" }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-extrabold text-[1.1rem] tracking-tight group-hover:text-primary transition-colors">
              Wamuthondio
            </span>
            <span className="text-accent text-[0.65rem] font-bold uppercase tracking-[0.12em]">
              Cooking Gas Supply · Karatina
            </span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm text-white/80 hover:text-accent transition-colors font-medium">
              {l.label}
            </a>
          ))}
          <a
            href={WA_ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-whatsapp text-whatsapp-foreground px-5 py-2 rounded-full text-sm font-bold wa-btn transition-all duration-250"
          >
            Order Now
          </a>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:text-accent transition-colors p-2"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2" aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 pb-4" style={{ background: "#0F1F3D" }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-white/80 hover:text-accent hover:bg-white/5 font-medium"
            >
              {l.label}
            </a>
          ))}
          <div className="px-6 pt-2">
            <a
              href={WA_ORDER}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-whatsapp text-whatsapp-foreground px-5 py-3 rounded-full font-bold"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
