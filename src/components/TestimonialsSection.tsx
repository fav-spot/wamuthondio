const WA_ORDER = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20place%20another%20gas%20order.%20Please%20help.";

const reviews = [
  {
    text: "I called at 9am and had gas at my door by 11am. Fast, reliable, and very professional. I will never go anywhere else for my gas.",
    name: "Grace Wanjiku",
    tag: "Household Customer, Karatina",
  },
  {
    text: "The best gas prices in Karatina. I have been a customer for over two years and they have never let me down. Free delivery is a real bonus.",
    name: "James Mwangi",
    tag: "Restaurant Owner, Karatina",
  },
  {
    text: "Switched from my old supplier after Wamuthondio delivered my 13kg cylinder in under two hours. Very trustworthy people.",
    name: "Mary Njeri",
    tag: "Household Customer, Kiamaina",
  },
  {
    text: "The refilling guide explained everything I needed to know. I now know exactly which brand to ask for. Great service and totally honest.",
    name: "Peter Kamau",
    tag: "Shop Owner, Karatina",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-white overflow-hidden border-t border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[#E85D04] font-bold text-[0.85rem] uppercase tracking-widest drop-shadow-sm">What Customers Say</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0F1F3D] mt-3 mb-4 leading-tight">
            Trusted by Families Across Karatina
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Don't just take our word for it.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="scroll-reveal bg-white/80 backdrop-blur-xl rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(232,93,4,0.08)] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative group"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="absolute top-4 right-8 text-[6rem] text-[#0F1F3D]/5 leading-none font-serif group-hover:text-[#E85D04]/10 transition-colors duration-500">"</span>
              <div className="flex items-center gap-1.5 mb-6">
                {[...Array(5)].map((_, s) => (
                  <span key={s} className="text-[#FFB703] text-lg drop-shadow-sm">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic text-[1.1rem] leading-relaxed mb-8 relative z-10 font-medium">"{r.text}"</p>
              
              <div className="flex items-center gap-4 relative z-10 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F1F3D] to-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-[#0F1F3D] text-[1.05rem]">{r.name}</p>
                  <p className="text-gray-500 text-sm font-medium">{r.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center scroll-reveal">
          <p className="text-gray-500 text-[1.05rem] mb-6 font-medium">
            Happy with our service? Tell a friend — or order again.
          </p>
          <a
            href={WA_ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Order Again on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
