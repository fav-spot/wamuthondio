import kgas6 from "@/assets/kgas-6kg.png";
import progas6 from "@/assets/progas-6kg.png";
import afrigas6 from "@/assets/afrigas-6kg.png";
import gassesMixed from "@/assets/gasses-mixed.png";
import kgas13 from "@/assets/kgas-13kg.png";
import total13 from "@/assets/total-13kg.png";
import { useMediaSection } from "@/hooks/useMediaSection";

const WA = "https://wa.me/254722446378?text=";

type Cyl = { brand: string; image?: string; color?: string; fallbackColor?: string };

const cylinders6kg: Cyl[] = [
  { brand: "K-Gas", image: kgas6, color: "#DC2626" },
  { brand: "Pro-Gas", image: progas6, color: "#16A34A" },
  { brand: "Afrigas", image: afrigas6, color: "#CA8A04" },
  { brand: "Total Gas", image: total13, color: "#1D4ED8" },
  { brand: "Mixed Brands", image: gassesMixed, color: "#6B7280" },
  { brand: "Local Brands", fallbackColor: "#7C3AED" },
];

const cylinders13kg: Cyl[] = [
  { brand: "K-Gas 13kg", image: kgas13, color: "#DC2626" },
  { brand: "Total 13kg", image: total13, color: "#1D4ED8" },
  { brand: "Afrigas 13kg", image: afrigas6, color: "#CA8A04" },
];

const palette = ["#DC2626", "#1D4ED8", "#16A34A", "#CA8A04", "#7C3AED", "#0F766E"];

function CylinderCard({ c, i, size }: { c: Cyl; i: number; size: string }) {
  const orderMsg = encodeURIComponent(`Hi, I'd like to order a ${size} gas cylinder. Please advise on availability.`);
  return (
    <div
      className="scroll-reveal w-full rounded-[20px] overflow-hidden shadow-md hover:shadow-[0_12px_32px_rgba(232,93,4,0.2)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-2 bg-card group"
      style={{ transitionDelay: `${i * 0.08}s` }}
    >
      {c.image ? (
        <div className="overflow-hidden h-[220px]">
          <img src={c.image} alt={c.brand} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      ) : (
        <div className="h-[220px] flex flex-col items-center justify-center" style={{ backgroundColor: c.fallbackColor || c.color }}>
          <span className="text-5xl mb-2">🛢️</span>
          <span className="font-bold text-base text-white">{c.brand}</span>
        </div>
      )}
      <div className="p-3 text-center">
        <span
          className="inline-block text-[0.7rem] font-bold text-white px-3 py-0.5 rounded-full mb-1"
          style={{ backgroundColor: c.color || c.fallbackColor }}
        >
          {c.brand}
        </span>
        <a
          href={`${WA}${orderMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block bg-whatsapp text-whatsapp-foreground text-xs font-bold px-4 py-2 rounded-full wa-btn transition-all duration-250"
        >
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}

function PriceCard({ badge, badgeColor, title, desc, waText }: {
  badge: string; badgeColor: string; title: string; desc: string; waText: string;
}) {
  return (
    <div className="scroll-reveal bg-card rounded-[20px] p-6 border border-primary/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center hover-card transition-all duration-300">
      <span className="inline-block text-xs font-bold text-white px-3 py-1 rounded-full mb-3" style={{ backgroundColor: badgeColor }}>
        {badge}
      </span>
      <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm mb-3">{desc}</p>
      <p className="italic text-primary text-[0.9rem] mb-2">📞 Call or WhatsApp for today's best price</p>
      <span className="inline-block text-[0.7rem] font-bold px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "#FFB703", color: "#0F1F3D" }}>
        Prices updated daily
      </span>
      <a
        href={`${WA}${encodeURIComponent(waText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-whatsapp text-whatsapp-foreground px-6 py-3 rounded-full font-bold text-sm wa-btn transition-all duration-250"
      >
        Order via WhatsApp
      </a>
    </div>
  );
}

export default function ProductSection() {
  const six = useMediaSection("6kg Gallery");
  const thirteen = useMediaSection("13kg Gallery");

  const sixCards: Cyl[] = six.items.length
    ? six.items.map((m, idx) => ({
        brand: m.alt_text || `6kg Cylinder ${idx + 1}`,
        image: m.file_url,
        color: palette[idx % palette.length],
      }))
    : cylinders6kg;

  const thirteenCards: Cyl[] = thirteen.items.length
    ? thirteen.items.map((m, idx) => ({
        brand: m.alt_text || `13kg Cylinder ${idx + 1}`,
        image: m.file_url,
        color: palette[idx % palette.length],
      }))
    : cylinders13kg;

  return (
    <>
      {/* 6kg Section */}
      <section id="products" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 scroll-reveal">
            <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">What We Sell</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">6kg Gas Cylinders</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Perfect for households. Light, portable, and ideal for daily cooking needs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {sixCards.map((c, i) => (
              <CylinderCard key={`${c.brand}-${i}`} c={c} i={i} size="6kg" />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PriceCard
              badge="Refill" badgeColor="#E85D04"
              title="6kg Gas Refill"
              desc="Have a cylinder already? We refill it fast and deliver it straight back to you."
              waText="Hi, I need a 6kg gas refill. Please advise on availability and delivery."
            />
            <PriceCard
              badge="New Cylinder" badgeColor="#0F1F3D"
              title="6kg Full Cylinder"
              desc="Brand new cylinder with gas. Ready to cook the moment we deliver it."
              waText="Hi, I'd like to buy a new 6kg full gas cylinder. Please advise on availability."
            />
          </div>
        </div>
      </section>

      {/* 13kg Section */}
      <section id="products-13kg" className="py-16 sm:py-20" style={{ background: "#FFF4EC" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 scroll-reveal">
            <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">Bigger & Better Value</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">13kg Gas Cylinders</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Ideal for families and small restaurants. Lasts longer and saves you from frequent refills.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {thirteenCards.map((c, i) => (
              <CylinderCard key={`${c.brand}-${i}`} c={c} i={i} size="13kg" />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PriceCard
              badge="Best Value" badgeColor="#E85D04"
              title="13kg Gas Refill"
              desc="Have an existing 13kg cylinder? Fast refill and delivered back to you the same day."
              waText="Hi, I need a 13kg gas refill. Please advise on availability and delivery."
            />
            <PriceCard
              badge="New Cylinder" badgeColor="#0F1F3D"
              title="13kg Full Cylinder"
              desc="Brand new 13kg cylinder with gas included. Perfect for busy households and restaurants."
              waText="Hi, I'd like to buy a new 13kg full gas cylinder. Please advise on availability."
            />
          </div>
        </div>
      </section>
    </>
  );
}
