import ContactForm from "./ContactForm";

const WA_CHAT = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20place%20a%20gas%20order%20with%20Wamuthondio.%20Please%20help.";
const MAPS_LINK = "https://maps.google.com/?q=Karatina+Town+Nyeri+Kenya";

const contactItems = [
  { icon: "📞", label: "Phone & WhatsApp", value: "0722 446 378", href: "tel:+254722446378" },
  { icon: "📍", label: "Location", value: "Karatina Town, Nyeri County, Kenya" },
  { icon: "🕐", label: "Business Hours", value: "Mon–Sat: 6:00am – 10:00pm\nSunday morning: 7:00am – 10:00am\nSunday afternoon: 2:00pm – 10:00pm" },
  { icon: "🚚", label: "Delivery", value: "Karatina Town and surrounding areas. We offer very competitive prices. Come one, come all." },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-20" style={{ background: "#F8F6F1" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">We're Ready to Deliver to You</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Call, WhatsApp, or walk in. We are here for you every day in Karatina Town.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="scroll-reveal space-y-5">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-bold text-secondary hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-bold text-secondary text-sm whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <a
              href={WA_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-whatsapp text-whatsapp-foreground px-8 py-3 rounded-full font-bold wa-btn transition-all duration-250 mt-4"
            >
              Open WhatsApp Chat
            </a>
            <a
              href="tel:+254722446378"
              className="block text-center border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-250"
            >
              📞 Call 0722 446 378
            </a>
          </div>

          <div className="scroll-reveal space-y-5" style={{ transitionDelay: "0.15s" }}>
            <div className="bg-white rounded-[20px] border border-primary/15 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 flex flex-col items-center justify-center text-center hover-card transition-all duration-300">
              <span className="text-[3rem] mb-3">📍</span>
              <h3 className="font-bold text-secondary text-lg mb-1">Karatina Town, Nyeri County</h3>
              <p className="text-muted-foreground text-[0.9rem] mb-5">
                We deliver to Karatina and surrounding areas. Call us to confirm coverage in your specific area.
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm hover:bg-[#c94e00] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(232,93,4,0.4)] transition-all duration-250"
              >
                Open in Google Maps
              </a>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
