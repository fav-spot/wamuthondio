import heroBg from "@/assets/hero-bg.png";

const steps = [
  {
    icon: "🛢️",
    title: "Choose Your Size",
    desc: "Pick 6kg or 13kg. Tell us if you need a refill or a brand-new cylinder, and which brand if applicable.",
  },
  {
    icon: "💬",
    title: "WhatsApp or Call Us",
    desc: (
      <>
        Send a message or call{" "}
        <a href="tel:+254722446378" className="text-[#FFB703] underline hover:text-white transition-colors font-bold">
          0722 446 378
        </a>
        . We confirm your order immediately.
      </>
    ),
  },
  {
    icon: "🏍️",
    title: "We Deliver to You",
    desc: "We bring your gas by motorcycle. Same-day delivery for orders placed early enough in the day.",
  },
];

export default function HowToOrder() {
  return (
    <section id="how-to-order" className="relative py-24 sm:py-32 overflow-hidden border-t border-gray-800">
      {/* Immersive Dark Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-[#0F1F3D]/95 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 z-10">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[#FFB703] font-bold text-[0.85rem] uppercase tracking-widest drop-shadow-sm">Simple Process</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4 drop-shadow-md">How to Order</h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto drop-shadow-sm">
            Getting gas delivered to your door takes 3 simple steps. No queues. No stress.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden sm:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {steps.map((s, i) => (
            <div
              key={i}
              className="scroll-reveal relative text-center bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 transition-all duration-500 shadow-xl"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#E85D04] text-white font-extrabold text-xl flex items-center justify-center shadow-lg border-4 border-[#0F1F3D] z-10">
                {i + 1}
              </div>
              <div className="text-6xl mb-6 mt-4 drop-shadow-xl">{s.icon}</div>
              <h3 className="text-2xl font-extrabold text-white mb-3 drop-shadow-md">{s.title}</h3>
              <p className="text-white/70 text-[1.05rem] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
