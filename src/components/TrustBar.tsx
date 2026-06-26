import flameLogo from "@/assets/flame-logo.png";

const FlameIcon = ({ size = 18 }: { size?: number }) => (
  <img
    src={flameLogo}
    alt="Wamuthondio Gas Supply Logo"
    style={{ height: size, width: "auto", objectFit: "contain", background: "transparent", display: "inline-block", verticalAlign: "middle" }}
  />
);

const TrustItems = () => (
  <>
    <span className="mx-6">🕐 Mon–Sat 6am–10pm · Sun 7–10am & 2–10pm</span>
    <span className="mx-6 inline-flex items-center gap-2"><FlameIcon /> K-Gas · Total · Pro-Gas · Afri-Gas · Wanjiko · Kerry Gas · Sea Gas · Taifa Gas · Gasky & many more</span>
    <a href="tel:+254722446378" className="mx-6 hover:text-accent transition-colors">📞 0722 446 378</a>
    <span className="mx-6">🏠 Serving Karatina and its environs</span>
  </>
);

export default function TrustBar() {
  return (
    <section className="border-b-[3px] border-primary overflow-hidden relative" style={{ background: "#0F1F3D", padding: "16px 0" }}>
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex items-center text-white/85 text-[0.85rem] font-medium w-max">
          {/* We repeat the items multiple times so it's long enough to cover large screens seamlessly */}
          <TrustItems />
          <TrustItems />
          <TrustItems />
          <TrustItems />
          <TrustItems />
          <TrustItems />
        </div>
      </div>
    </section>
  );
}
