import kgas6 from "@/assets/kgas-6kg.png";
import progas6 from "@/assets/progas-6kg.png";
import afrigas6 from "@/assets/afrigas-6kg.png";
import gassesMixed from "@/assets/gasses-mixed.png";
import kgas13 from "@/assets/kgas-13kg.png";
import total13 from "@/assets/total-13kg.png";
import burner1 from "@/assets/burner-1.png";
import burner2 from "@/assets/burner-2.png";
import regulator1 from "@/assets/regulator-1.png";
import { useMediaSection } from "@/hooks/useMediaSection";
import { ShoppingCart } from "lucide-react";

const WA = "https://wa.me/254722446378?text=";

type Cyl = { brand: string; image?: string; color?: string; fallbackColor?: string; tag?: string };

const cylinders6kg: Cyl[] = [
  { brand: "Pro-Gas", image: progas6, color: "#16A34A", tag: "Best Seller" },
  { brand: "K-Gas", image: kgas6, color: "#DC2626" },
  { brand: "Afrigas", image: afrigas6, color: "#CA8A04" },
  { brand: "Mixed Brands", image: gassesMixed, color: "#6B7280" },
];

const cylinders13kg: Cyl[] = [
  { brand: "Total Gas", image: total13, color: "#1D4ED8", tag: "Top Rated" },
  { brand: "K-Gas", image: kgas13, color: "#DC2626" },
  { brand: "Afrigas", image: afrigas6, color: "#CA8A04" }, // Using afrigas6 as placeholder for 13kg if missing
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
      className="scroll-reveal group relative flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
      style={{ transitionDelay: `${i * 0.05}s` }}
    >
      {/* Top Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span 
          className="text-[0.65rem] font-bold text-white uppercase tracking-wider px-2 py-1 rounded-md"
          style={{ backgroundColor: c.color || c.fallbackColor }}
        >
          {c.brand}
        </span>
        {c.tag && (
          <span className="text-[0.65rem] font-bold bg-[#FFB703] text-[#0F1F3D] uppercase tracking-wider px-2 py-1 rounded-md w-max shadow-sm">
            {c.tag}
          </span>
        )}
      </div>

      {/* Image Area (Transparent background so it pops) */}
      <div className="relative pt-14 pb-8 px-6 flex-1 flex items-center justify-center bg-gray-50/50 group-hover:bg-orange-50/30 transition-colors duration-500">
        {c.image ? (
          <img 
            src={c.image} 
            alt={c.brand} 
            className="w-full h-40 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-2">🛢️</span>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="p-5 border-t border-gray-50 bg-white">
        <h3 className="font-extrabold text-gray-900 text-lg mb-1">{c.brand} {category !== "Accessory" ? category : ""}</h3>
        <p className="text-sm text-gray-500 mb-4">In stock. Ready for delivery.</p>
        
        <a
          href={`${WA}${orderMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-[#E85D04] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
        >
          <ShoppingCart size={16} />
          Add to Order
        </a>
      </div>
    </div>
  );
}

function SectionHeader({ subtitle, title, desc }: { subtitle: string, title: string, desc: string }) {
  return (
    <div className="text-center mb-12 scroll-reveal">
      <span className="text-[#E85D04] font-bold text-[0.8rem] uppercase tracking-widest">{subtitle}</span>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1F3D] mt-3 mb-4">{title}</h2>
      <p className="text-gray-500 text-lg max-w-2xl mx-auto">{desc}</p>
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
    <div className="bg-white">
      {/* 6kg Section */}
      <section id="products" className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle="Household Essentials" 
            title="6kg Gas Cylinders" 
            desc="Light, portable, and ideal for daily cooking. Order a new cylinder or request a quick refill." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {sixCards.map((c, i) => (
              <ProductPod key={`6kg-${c.brand}-${i}`} c={c} i={i} category="6kg" />
            ))}
          </div>
        </div>
      </section>

      {/* 13kg Section */}
      <section id="products-13kg" className="py-20 sm:py-28 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle="Bigger & Better Value" 
            title="13kg Gas Cylinders" 
            desc="Ideal for families and small restaurants. Lasts longer and saves you from frequent refills." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {thirteenCards.map((c, i) => (
              <ProductPod key={`13kg-${c.brand}-${i}`} c={c} i={i} category="13kg" />
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section id="accessories" className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle="Cooking Gear" 
            title="Burners & Accessories" 
            desc="High-quality burners, grills, and safety regulators to complete your kitchen setup." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {accessories.map((c, i) => (
              <ProductPod key={`acc-${c.brand}-${i}`} c={c} i={i} category="Accessory" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
