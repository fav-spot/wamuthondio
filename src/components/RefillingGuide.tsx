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
    <section id="refilling-guide" className="relative py-20 sm:py-28 overflow-hidden border-t border-gray-100 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white pointer-events-none" />
      
      <div className="relative container mx-auto px-4 z-10">
        <div className="text-center mb-14 scroll-reveal">
          <span className="text-[#E85D04] font-bold text-[0.85rem] uppercase tracking-widest drop-shadow-sm">Important Information</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0F1F3D] mt-3 mb-4 leading-tight">
            Refilling Rules — Read Before You Order
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Understanding this will save you time and make sure we serve you without any delays.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Brand-locked card A */}
          <div className="scroll-reveal bg-white/80 backdrop-blur-xl rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t border-l border-white border-l-[#DC2626] border-l-[6px] hover:-translate-y-2 transition-all duration-500">
            <h3 className="text-2xl font-extrabold text-[#0F1F3D] mb-2">⚠️ Brand-Locked Cylinders</h3>
            <p className="text-[1.05rem] text-gray-500 mb-6">These brands can ONLY be refilled with the same brand:</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {lockedCards.map((b) => (
                <div
                  key={b.name}
                  className="relative rounded-2xl overflow-hidden bg-gray-50/80 border border-gray-100 flex flex-col items-center p-4 transition-all duration-300 hover:shadow-lg cursor-default group"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 15px 30px -10px ${b.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {b.image ? (
                    <img src={b.image} alt={b.name} className="w-[100px] h-[100px] object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div
                      className="w-[100px] h-[100px] rounded-xl flex items-center justify-center text-4xl drop-shadow-sm"
                      style={{ backgroundColor: `${b.color}11`, color: b.color }}
                    >
                      🛢️
                    </div>
                  )}
                  <span
                    className="font-bold text-[0.7rem] text-white mt-3 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: b.color }}
                  >
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
              If you own a brand-locked cylinder, we can only refill it with the same brand. This is a strict safety and compliance rule.
            </p>
          </div>

          {/* Universal card B */}
          <div className="scroll-reveal bg-white/80 backdrop-blur-xl rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t border-l border-white border-l-[#16A34A] border-l-[6px] flex flex-col hover:-translate-y-2 transition-all duration-500" style={{ transitionDelay: "0.15s" }}>
            <h3 className="text-2xl font-extrabold text-[#0F1F3D] mb-2">✅ Universal Exchange Brands</h3>
            <p className="text-[1.05rem] text-gray-600 mb-6 leading-relaxed">
              If your cylinder is any other brand not listed above — such as Hashi Gas, Okenye, Lake Gas, or any unbranded cylinder — you can freely exchange it for any brand we have in stock on that day.
            </p>
            <div className="bg-[#16A34A]/5 p-5 rounded-2xl border border-[#16A34A]/10 mb-8">
              <p className="text-sm text-[#0F1F3D] font-medium leading-relaxed">
                <span className="font-bold text-[#16A34A]">Not sure which brand your cylinder is?</span><br />
                Send us a quick photo on WhatsApp and we will advise you instantly before you travel.
              </p>
            </div>
            <div className="mt-auto">
              <a
                href={WA_PHOTO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Send Us a Photo
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic brand pill cloud */}
        <div className="max-w-4xl mx-auto mt-12 scroll-reveal">
          <div className="bg-white/80 backdrop-blur-lg rounded-[24px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-lg font-extrabold text-[#0F1F3D] mb-4 text-center">All Gas Brands We Stock</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {allBrands.map((b) => (
                <BrandPill key={b.id} name={b.brand_name} colour={b.brand_colour} />
              ))}
            </div>
            <p className="text-sm text-gray-500 italic text-center">
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
