const items = [
  { icon: "⚡", title: "Same-Day Delivery", desc: "Order and we come to you. No queues. No waiting around." },
  { icon: "💰", title: "Fair Local Prices", desc: "Honest pricing, no hidden charges. What you see is what you pay." },
  { icon: "✅", title: "Licensed & Safe", desc: "EPRA-compliant. Certified brands only. Your safety comes first." },
  { icon: "🏘️", title: "Truly Local", desc: "Based in Karatina. We know this community and we are proud to serve it." },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-16 sm:py-20" style={{ background: "#FFF4EC" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">Karatina's Trusted Gas Supplier</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Serving households and businesses across Karatina and surrounding areas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="scroll-reveal bg-white rounded-[18px] p-6 border border-primary/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(232,93,4,0.15)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-[2.2rem] mb-3">{item.icon}</div>
              <h3 className="font-extrabold text-secondary mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
