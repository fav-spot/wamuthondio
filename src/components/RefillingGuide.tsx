import kgas6 from "@/assets/kgas-6kg.png";
import total13 from "@/assets/total-13kg.png";
import progas6 from "@/assets/progas-6kg.png";
import afrigas6 from "@/assets/afrigas-6kg.png";
import { useMediaSection } from "@/hooks/useMediaSection";
import { useBrands } from "@/hooks/useBrands";

const WA_PHOTO = "https://wa.me/254722446378?text=Hi%2C%20I%27m%20not%20sure%20about%20my%20cylinder%20brand.%20Can%20I%20send%20you%20a%20photo%20for%20advice%20before%20I%20come%3F";

const staticBrandLocked = [
  { name: "K-Gas", image: kgas6, color: "#E24B4A" },
  { name: "Total Gas", image: total13, color: "#185FA5" },
  { name: "Pro-Gas", image: progas6, color: "#3B6D11" },
  { name: "Afri-Gas", image: afrigas6, color: "#BA7517" },
];

export default function RefillingGuide() {
  // Brand-locked cards (Card A) — read from brands table
  const { brands: lockedBrands } = useBrands({ onlyActive: true, onlyLocked: true });
  // Brand logos in Card A images — fall back to static photos when no media
  const { items: brandLogoMedia } = useMediaSection("Brand Logos");
  // Pill cloud — all active brands
  const { brands: allBrands } = useBrands({ onlyActive: true });

  // Build the 4 brand-locked cards. Match each locked brand to a logo image
  // by alt_text (case-insensitive). Otherwise fall back to static images by name.
  const lockedCards = (lockedBrands.length ? lockedBrands : staticBrandLocked.map((s, i) => ({
    id: String(i),
    brand_name: s.name,
    brand_colour: s.color,
    is_active: true,
    is_brand_locked: true,
    display_order: i + 1,
  }))).map((b) => {
    const matchMedia = brandLogoMedia.find(
      (m) => (m.alt_text || "").trim().toLowerCase() === b.brand_name.trim().toLowerCase()
    );
    const staticMatch = staticBrandLocked.find(
      (s) => s.name.trim().toLowerCase() === b.brand_name.trim().toLowerCase()
    );
    return {
      name: b.brand_name,
      color: b.brand_colour,
      image: matchMedia?.file_url ?? staticMatch?.image,
    };
  });

  return (
    <section id="refilling-guide" className="py-16 sm:py-20" style={{ background: "#FFF4EC" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">Important Information</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">
            Refilling Rules — Read Before You Order
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Understanding this will save you time and make sure we serve you without any delays.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Brand-locked card A */}
          <div className="scroll-reveal bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-l-4 border-l-destructive hover-card transition-all duration-300">
            <h3 className="text-xl font-bold text-foreground mb-1">⚠️ Brand-Locked Cylinders</h3>
            <p className="text-sm text-muted-foreground mb-5">These brands can ONLY be refilled with the same brand:</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {lockedCards.map((b) => (
                <div
                  key={b.name}
                  className="rounded-xl overflow-hidden bg-muted/50 flex flex-col items-center p-3 transition-all duration-300 hover:-translate-y-1 cursor-default"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${b.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {b.image ? (
                    <img src={b.image} alt={b.name} className="w-[120px] h-[120px] object-contain" />
                  ) : (
                    <div
                      className="w-[120px] h-[120px] rounded-xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${b.color}22`, color: b.color }}
                    >
                      🛢️
                    </div>
                  )}
                  <span
                    className="font-bold text-xs text-white mt-2 px-3 py-0.5 rounded-full"
                    style={{ backgroundColor: b.color }}
                  >
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              If you own a brand-locked cylinder, we can only refill it with the same brand. This is a brand compliance rule we must follow.
            </p>
          </div>

          {/* Universal card B */}
          <div className="scroll-reveal bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-l-4 border-l-whatsapp flex flex-col hover-card transition-all duration-300" style={{ transitionDelay: "0.15s" }}>
            <h3 className="text-xl font-bold text-foreground mb-1">✅ Universal Exchange Brands</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If your cylinder is any other brand not listed above — such as Hashi Gas, Okenye, Lake Gas, or any unbranded cylinder — you can freely exchange it for any brand we have in stock on that day.
            </p>
            <p className="text-xs text-secondary italic mb-6 border-t border-border pt-4">
              Not sure which brand your cylinder is? Send us a quick photo on WhatsApp and we will advise you before you travel.
            </p>
            <div className="mt-auto">
              <a
                href={WA_PHOTO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-whatsapp text-whatsapp-foreground px-6 py-3 rounded-full font-bold text-sm wa-btn transition-all duration-250"
              >
                Send Us a Photo
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic brand pill cloud */}
        <div className="max-w-4xl mx-auto mt-10 scroll-reveal">
          <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-primary/10">
            <h3 className="text-base font-bold text-foreground mb-3 text-center">All Gas Brands We Stock</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {allBrands.map((b) => (
                <BrandPill key={b.id} name={b.brand_name} colour={b.brand_colour} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic text-center">
              Stock varies daily. WhatsApp us to confirm your preferred brand is available before you come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandPill({ name, colour }: { name: string; colour: string }) {
  return (
    <span
      className="inline-block bg-white text-[0.8rem] font-semibold px-3.5 py-1.5 rounded-lg cursor-default transition-all duration-200 ease-in-out"
      style={{
        border: `1px solid ${colour}`,
        color: "#0F1F3D",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = colour;
        el.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "#FFFFFF";
        el.style.color = "#0F1F3D";
      }}
    >
      {name}
    </span>
  );
}
