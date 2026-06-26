const items = [
  { icon: "⚡", title: "Same-Day Delivery", desc: "Order and we come to you. No queues. No waiting around." },
  { icon: "💰", title: "Fair Local Prices", desc: "Honest pricing, no hidden charges. What you see is what you pay." },
  { icon: "✅", title: "Licensed & Safe", desc: "EPRA-compliant. Certified brands only. Your safety comes first." },
  { icon: "🏘️", title: "Truly Local", desc: "Based in Karatina. We know this community and we are proud to serve it." },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 sm:py-28 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[#E85D04] font-bold text-[0.85rem] uppercase tracking-widest drop-shadow-sm">Why Choose Us</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0F1F3D] mt-3 mb-4 leading-tight">Karatina's Trusted Gas Supplier</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Serving households and businesses across Karatina and surrounding areas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="scroll-reveal bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(232,93,4,0.15)] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-20 h-20 mx-auto bg-gray-50/80 rounded-2xl flex items-center justify-center text-[2.5rem] mb-6 shadow-inner group-hover:bg-[#E85D04]/10 transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-extrabold text-[#0F1F3D] mb-3">{item.title}</h3>
              <p className="text-[1.05rem] text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
