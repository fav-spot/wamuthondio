import flameLogo from "@/assets/flame-logo.png";

const FlameIcon = ({ size = 18 }: { size?: number }) => (
  <img
    src={flameLogo}
    alt="Wamuthondio Gas Supply Logo"
    style={{ height: size, width: "auto", objectFit: "contain", background: "transparent", display: "inline-block", verticalAlign: "middle" }}
  />
);

export default function TrustBar() {
  return (
    <section className="border-b-[3px] border-primary overflow-hidden" style={{ background: "#0F1F3D", padding: "18px 6%" }}>
      <div className="hidden md:flex flex-wrap justify-center items-center gap-5 text-white/85 text-[0.85rem] font-medium">
        <span>🕐 Mon–Sat 6am–10pm · Sun 7–10am & 2–10pm</span>
        <span className="inline-flex items-center gap-2"><FlameIcon /> K-Gas · Total · Pro-Gas · Afri-Gas · Wanjiko · Kerry Gas · Sea Gas · Taifa Gas · Gasky & many more</span>
        <a href="tel:+254722446378" className="hover:text-accent transition-colors">📞 0722 446 378</a>
        <span>🏠 Serving Karatina and its environs</span>
      </div>
      {/* Mobile: marquee */}
      <div className="md:hidden whitespace-nowrap overflow-hidden">
        <div className="inline-block animate-[marquee_28s_linear_infinite] text-white/85 text-[0.82rem] font-medium">
          <span className="mx-4">🕐 Mon–Sat 6am–10pm · Sun 7–10am & 2–10pm</span>
          <span className="mx-4 inline-flex items-center gap-2"><FlameIcon /> K-Gas · Total · Pro-Gas · Afri-Gas · Wanjiko · Kerry Gas · Sea Gas · Taifa Gas · Gasky & many more</span>
          <a href="tel:+254722446378" className="mx-4 hover:text-accent transition-colors">📞 0722 446 378</a>
          <span className="mx-4">🏠 Serving Karatina and its environs</span>
          <span className="mx-4">🕐 Mon–Sat 6am–10pm · Sun 7–10am & 2–10pm</span>
          <span className="mx-4 inline-flex items-center gap-2"><FlameIcon /> K-Gas · Total · Pro-Gas · Afri-Gas · Wanjiko · Kerry Gas · Sea Gas · Taifa Gas · Gasky & many more</span>
        </div>
      </div>
    </section>
  );
}
