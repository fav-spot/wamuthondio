import kgas6 from "@/assets/kgas-6kg.png";
import progas6 from "@/assets/progas-6kg.png";
import afrigas6 from "@/assets/afrigas-6kg.png";
import gassesMixed from "@/assets/gasses-mixed.png";
import kgas13 from "@/assets/kgas-13kg.png";
import total13 from "@/assets/total-13kg.png";
import burner1 from "@/assets/burner-1.png";
import burner2 from "@/assets/burner-2.png";
import regulator1 from "@/assets/regulator-1.png";
import heroBg from "@/assets/hero-bg.png";
import { useMediaSection } from "@/hooks/useMediaSection";
import { ShoppingCart } from "lucide-react";

const WA = "https://wa.me/254722446378?text=";

type Cyl = { brand: string; image?: string; color?: string; fallbackColor?: string; tag?: string };

const cylinders6kg: Cyl[] = [
  { brand: "Pro-Gas", image: progas6, color: "#16A34A", tag: "Best Seller" },
  { brand: "K-Gas", image: kgas6, color: "#DC2626" },
  { brand: "Afrigas", image: afrigas6, color: "#CA8A04" },
  { brand: "Taifa Gas", image: afrigas6, color: "#EA580C" }, // Using afrigas as stand-in until real transparent PNG is provided
  { brand: "Mixed Brands", image: gassesMixed, color: "#6B7280" },
];

const cylinders13kg: Cyl[] = [
  { brand: "Total Gas", image: total13, color: "#1D4ED8", tag: "Top Rated" },
  { brand: "K-Gas", image: kgas13, color: "#DC2626" },
  { brand: "Afrigas", image: afrigas6, color: "#CA8A04" }, 
];

const accessories: Cyl[] = [
  { brand: "Premium Burner", image: burner1, color: "#0F1F3D", tag: "Heavy Duty" },
  { brand: "Standard Burner", image: burner2, color: "#0F1F3D" },
  { brand: "Safety Regulator", image: regulator1, color: "#E85D04", tag: "Essential" },
];

const palette = ["#DC2626", "#1D4ED8", "#16A34A", "#CA8A04", "#7C3AED", "#0F766E"];

function ProductPod({ c, i, category }: { c: Cyl; i: number; category: string }) {
  const orderMsg = encodeURIComponent(`Hi, I'd like to order a ${c.brand} ${category}. Please advise on availability and price.`);
  return (
    <div
      className="scroll-reveal group relative flex flex-col bg-white/95 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-lg hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2"
      style={{ transitionDelay: `${i * 0.05}s` }}
    >
      {/* Top Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <span 
          className="text-[0.65rem] font-bold text-white uppercase tracking-wider px-3 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: c.color || c.fallbackColor }}
        >
          {c.brand}
        </span>
        {c.tag && (
          <span className="text-[0.65rem] font-bold bg-[#FFB703] text-[#0F1F3D] uppercase tracking-wider px-3 py-1 rounded-full w-max shadow-sm">
            {c.tag}
          </span>
        )}
      </div>

      {/* Authentic "Studio Pedestal" Image Area */}
      <div className="relative pt-16 pb-10 px-6 flex-1 flex items-center justify-center bg-gradient-to-b from-white to-gray-50/80">
        {/* Soft radial shadow under the cylinder to ground it */}
        <div className="absolute bottom-6 w-32 h-6 bg-black/20 rounded-[100%] blur-md group-hover:bg-black/30 group-hover:scale-110 transition-all duration-500" />
        
        {c.image ? (
          <img 
            src={c.image} 
            alt={c.brand} 
            className="relative z-10 w-full h-44 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2" 
          />
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-gray-400 relative z-10 drop-shadow-md">
            <span className="text-6xl mb-2">🛢️</span>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="p-5 border-t border-gray-100 bg-white relative z-20">
        <h3 className="font-extrabold text-gray-900 text-lg mb-1">{c.brand} {category !== "Accessory" ? category : ""}</h3>
        <p className="text-sm text-gray-500 mb-4">In stock. Ready for delivery.</p>
        
        <a
          href={`${WA}${orderMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#0F1F3D] hover:bg-[#E85D04] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-300 shadow-md"
        >
          <ShoppingCart size={18} />
          Add to Order
        </a>
      </div>
    </div>
  );
}

function SectionHeader({ subtitle, title, desc, isDark = false }: { subtitle: string, title: string, desc: string, isDark?: boolean }) {
  return (
    <div className="text-center mb-14 scroll-reveal relative z-20">
      <span className="text-[#FFB703] font-bold text-[0.85rem] uppercase tracking-widest">{subtitle}</span>
      <h2 className={`text-4xl sm:text-5xl font-extrabold mt-3 mb-5 ${isDark ? 'text-white drop-shadow-lg' : 'text-[#0F1F3D]'}`}>{title}</h2>
      <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-white/90 drop-shadow-md' : 'text-gray-600'}`}>{desc}</p>
    </div>
  );
}

export default function ProductSection() {
  const six = useMediaSection("6kg Gallery");
  const thirteen = useMediaSection("13kg Gallery");

  const sixCards: Cyl[] = six.items.length
    ? six.items.map((m, idx) => ({
        brand: m.alt_text || `6kg Gas ${idx + 1}`,
        image: m.file_url,
        color: palette[idx % palette.length],
      }))
    : cylinders6kg;

  const thirteenCards: Cyl[] = thirteen.items.length
    ? thirteen.items.map((m, idx) => ({
        brand: m.alt_text || `13kg Gas ${idx + 1}`,
        image: m.file_url,
        color: palette[idx % palette.length],
      }))
    : cylinders13kg;

  return (
    <div className="relative bg-white">
      {/* Immersive Parallax Background for the entire product area */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1F3D]/95 via-[#0F1F3D]/85 to-white pointer-events-none" />

      {/* 6kg Section */}
      <section id="products" className="relative py-24 sm:py-32 z-10">
        <div className="container mx-auto px-4">
          <SectionHeader 
            isDark={true}
            subtitle="Household Essentials" 
            title="6kg Gas Cylinders" 
            desc="Light, portable, and ideal for daily cooking. We stock all major brands. Order a new cylinder or request a lightning-fast refill." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {sixCards.map((c, i) => (
              <ProductPod key={`6kg-${c.brand}-${i}`} c={c} i={i} category="6kg" />
            ))}
          </div>
        </div>
      </section>

      {/* 13kg Section */}
      <section id="products-13kg" className="relative py-24 sm:py-32 z-10 border-t border-white/10">
        <div className="container mx-auto px-4">
          <SectionHeader 
            isDark={true}
            subtitle="Bigger & Better Value" 
            title="13kg Gas Cylinders" 
            desc="Ideal for families and small restaurants. Lasts longer and saves you from frequent refills." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {thirteenCards.map((c, i) => (
              <ProductPod key={`13kg-${c.brand}-${i}`} c={c} i={i} category="13kg" />
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section id="accessories" className="relative py-24 sm:py-32 bg-gray-50/90 z-10 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle="Cooking Gear" 
            title="Burners & Accessories" 
            desc="High-quality burners, grills, and safety regulators to complete your kitchen setup." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {accessories.map((c, i) => (
              <ProductPod key={`acc-${c.brand}-${i}`} c={c} i={i} category="Accessory" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
