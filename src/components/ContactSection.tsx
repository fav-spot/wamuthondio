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
    <section id="contact" className="py-20 sm:py-28 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[#E85D04] font-bold text-[0.85rem] uppercase tracking-widest drop-shadow-sm">Get In Touch</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0F1F3D] mt-3 mb-4 leading-tight">We're Ready to Deliver to You</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Call, WhatsApp, or walk in. We are here for you every day in Karatina Town.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
          <div className="scroll-reveal space-y-8">
            <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-extrabold tracking-widest mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-extrabold text-[#0F1F3D] text-[1.05rem] hover:text-[#E85D04] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-extrabold text-[#0F1F3D] text-[1.05rem] whitespace-pre-line leading-relaxed">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={WA_CHAT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp Us
              </a>
              <a
                href="tel:+254722446378"
                className="flex items-center justify-center gap-2 border-2 border-gray-200 text-[#0F1F3D] hover:border-[#0F1F3D] hover:bg-[#0F1F3D] hover:text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                📞 Call Us
              </a>
            </div>
          </div>

          <div className="scroll-reveal space-y-8" style={{ transitionDelay: "0.15s" }}>
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 sm:p-10 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-all duration-500">
              <span className="text-[4rem] mb-4 drop-shadow-sm">📍</span>
              <h3 className="font-extrabold text-[#0F1F3D] text-2xl mb-2">Karatina Town, Nyeri</h3>
              <p className="text-gray-500 text-[1.05rem] mb-8 leading-relaxed max-w-sm">
                We deliver to Karatina and surrounding areas. Call us to confirm coverage in your specific area.
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0F1F3D] text-white px-8 py-4 rounded-2xl font-bold text-[1.05rem] hover:bg-[#E85D04] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 sm:p-10">
              <h3 className="font-extrabold text-[#0F1F3D] text-xl mb-6 text-center">Send us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
