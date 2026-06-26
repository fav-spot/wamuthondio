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
    <section id="testimonials" className="py-16 sm:py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">What Customers Say</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">
            Trusted by Families Across Karatina
          </h2>
          <p className="text-muted-foreground text-lg">Don't just take our word for it.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="scroll-reveal bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-primary/10 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(232,93,4,0.12)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="text-[4rem] text-primary/25 leading-none font-serif">"</span>
              <p className="text-foreground/90 italic text-[0.95rem] leading-[1.7] mb-4 -mt-6">{r.text}</p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, s) => (
                  <span key={s} className="text-accent text-sm">★</span>
                ))}
              </div>
              <p className="font-extrabold text-secondary text-[1rem]">{r.name}</p>
              <p className="text-muted-foreground text-xs italic">{r.tag}</p>
            </div>
          ))}
        </div>

        <div className="text-center scroll-reveal">
          <p className="text-muted-foreground text-sm mb-4">
            Happy with our service? Tell a friend — or order again.
          </p>
          <a
            href={WA_ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-whatsapp text-whatsapp-foreground px-8 py-3 rounded-full font-bold wa-btn transition-all duration-250"
          >
            Order Again on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
