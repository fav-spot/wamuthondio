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

function ProductPod({ c, i, category, price }: { c: Cyl; i: number; category: string; price?: number | null }) {
  const isCylinder = category !== "Accessory";
  const orderMsg = encodeURIComponent(
    `Hi, I'd like to order a ${c.brand} ${isCylinder ? category : ""}. Please advise on ${isCylinder ? "today's price" : "price and availability"}.`
  );

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
      <div className="p-5 border-t border-gray-100 bg-white relative z-20 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-gray-900 text-lg mb-1 line-clamp-1" title={`${c.brand} ${isCylinder ? category : ""}`}>
            {c.brand} {isCylinder ? category : ""}
          </h3>
          
          {/* Dynamic Pricing / Availability Space */}
          {isCylinder ? (
            <p className="text-sm font-semibold text-[#E85D04] mb-4 flex items-center gap-1.5 bg-[#E85D04]/10 w-fit px-2 py-1 rounded-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85D04] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85D04]"></span>
              </span>
              Prices update daily
            </p>
          ) : (
            <p className="text-sm font-bold text-[#0F1F3D] mb-4 bg-gray-50 w-fit px-3 py-1 rounded-md border border-gray-100">
              {price ? `KSh ${price.toLocaleString()}` : "Price via WhatsApp"}
            </p>
          )}
        </div>
        
        <a
          href={`${WA}${orderMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#0F1F3D] hover:bg-[#E85D04] text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-300 shadow-md group-hover:shadow-lg"
        >
          <ShoppingCart size={18} />
          {isCylinder ? "Get Today's Price" : "Order Now"}
        </a>
      </div>
    </div>
  );
}

function SectionHeader({ subtitle, title, desc, isDark = false, showDailyPriceBanner = false }: { subtitle: string, title: string, desc: string, isDark?: boolean, showDailyPriceBanner?: boolean }) {
  return (
    <div className="text-center mb-14 scroll-reveal relative z-20 flex flex-col items-center">
      {showDailyPriceBanner && (
        <div className="mb-6 inline-flex items-center gap-2 bg-[#FFB703]/20 border border-[#FFB703]/50 backdrop-blur-sm text-[#FFB703] px-4 py-2 rounded-full shadow-lg animate-fade-in">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-bold tracking-wide">PRICES UPDATE DAILY - INQUIRE FOR TODAY'S BEST LOCAL RATE</span>
        </div>
      )}
      <span className="text-[#FFB703] font-bold text-[0.85rem] uppercase tracking-widest">{subtitle}</span>
      <h2 className={`text-4xl sm:text-5xl font-extrabold mt-3 mb-5 ${isDark ? 'text-white drop-shadow-lg' : 'text-[#0F1F3D]'}`}>{title}</h2>
      <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-white/90 drop-shadow-md' : 'text-gray-600'}`}>{desc}</p>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ProductSection() {
  const six = useMediaSection("6kg Gallery");
  const thirteen = useMediaSection("13kg Gallery");

  // Fetch accessory prices from the new Supabase table
  const { data: dbAccessories } = useQuery({
    queryKey: ["accessories_pricing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accessories").select("*");
      if (error) throw error;
      return data;
    },
    // Don't throw errors if table doesn't exist yet (before SQL run)
    retry: false,
  });

  const getAccessoryPrice = (brandName: string) => {
    if (!dbAccessories) return null;
    const match = dbAccessories.find((a: any) => a.item_name === brandName);
    return match ? match.price : null;
  };

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
            showDailyPriceBanner={true}
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
            showDailyPriceBanner={true}
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
              <ProductPod 
                key={`acc-${c.brand}-${i}`} 
                c={c} 
                i={i} 
                category="Accessory" 
                price={getAccessoryPrice(c.brand)} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
