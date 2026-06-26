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
        <a href="tel:+254722446378" className="text-accent underline hover:text-white transition-colors">
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
    <section id="how-to-order" className="py-16 sm:py-20" style={{ background: "#0F1F3D" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-accent font-bold text-[0.78rem] uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">How to Order</h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Getting gas delivered to your door takes 3 simple steps. No queues. No stress.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={i}
              className="scroll-reveal relative text-center rounded-[20px] p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.06)", transitionDelay: `${i * 0.12}s` }}
            >
              <span className="absolute top-3 right-4 text-5xl font-extrabold text-accent/[0.12]">{i + 1}</span>
              <div className="text-5xl mb-4">{s.icon}</div>
              <div className="inline-block bg-white/10 text-white/60 text-xs font-bold px-3 py-1 rounded-full mb-3">
                Step {i + 1}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-white/70 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
