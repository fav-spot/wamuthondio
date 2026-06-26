import burner1 from "@/assets/burner-1.png";
import burner2 from "@/assets/burner-2.png";
import regulator1 from "@/assets/regulator-1.png";
import { useMediaSection } from "@/hooks/useMediaSection";

const WA = "https://wa.me/254722446378?text=";

type Item = { name: string; image: string; price: string; waText: string };

const burnersStatic: Item[] = [
  { name: "Single Burner", image: burner1, price: "Ksh 250", waText: "Hi, I'd like to order a single gas burner at Ksh 250. Is it available?" },
  { name: "Double Burner", image: burner2, price: "Ksh 450", waText: "Hi, I'd like to order a double gas burner at Ksh 450. Is it available?" },
];

const regulatorsStatic: Item[] = [
  { name: "Gas Regulator", image: regulator1, price: "Ksh 650", waText: "Hi, I'd like to order a gas regulator at Ksh 650. Is it available?" },
];

function ProductCard({ name, image, price, waText }: Item) {
  return (
    <div className="scroll-reveal rounded-[16px] overflow-hidden shadow-md bg-card group hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(232,93,4,0.2)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
      <div className="overflow-hidden">
        <img src={image} alt={name} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="p-4 text-center">
        <p className="font-bold text-foreground text-sm">{name}</p>
        <p className="text-lg font-extrabold text-primary mt-1">{price}</p>
        <a
          href={`${WA}${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block bg-whatsapp text-whatsapp-foreground text-xs font-bold px-4 py-2.5 rounded-full wa-btn transition-all duration-250"
        >
          Order — {price}
        </a>
      </div>
    </div>
  );
}

export default function AccessoriesSection() {
  const burnersMedia = useMediaSection("Burners");
  const regulatorsMedia = useMediaSection("Regulators");

  const burners: Item[] = burnersMedia.items.length
    ? burnersMedia.items.map((m) => ({
        name: m.alt_text || "Gas Burner",
        image: m.file_url,
        price: "Ask price",
        waText: `Hi, I'd like to order ${m.alt_text || "a gas burner"}. Is it available?`,
      }))
    : burnersStatic;

  const regulators: Item[] = regulatorsMedia.items.length
    ? regulatorsMedia.items.map((m) => ({
        name: m.alt_text || "Gas Regulator",
        image: m.file_url,
        price: "Ask price",
        waText: `Hi, I'd like to order ${m.alt_text || "a gas regulator"}. Is it available?`,
      }))
    : regulatorsStatic;

  return (
    <section id="accessories" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">Accessories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">
            Gas Burners and Regulators
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Complete your setup. Quality accessories to keep your kitchen safe and running smoothly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4 scroll-reveal">🔥 Gas Burners</h3>
            <div className="grid grid-cols-2 gap-4">
              {burners.map((b, i) => (
                <ProductCard key={`${b.name}-${i}`} {...b} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4 scroll-reveal">⚙️ Gas Regulators</h3>
            <div className="grid grid-cols-2 gap-4">
              {regulators.map((r, i) => (
                <ProductCard key={`${r.name}-${i}`} {...r} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[13px] text-secondary italic mt-8 scroll-reveal">
          💡 Always use a certified regulator with your cylinder. Not sure which one fits your brand? Ask us on WhatsApp before you order.
        </p>
      </div>
    </section>
  );
}
