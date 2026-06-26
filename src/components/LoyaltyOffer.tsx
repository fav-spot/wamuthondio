const WA_LOYALTY = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20ask%20about%20the%20free%20burner%20replacement%20offer%20for%20loyal%20customers.";
const WA_PRICE = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20know%20today%27s%20gas%20price%20for%20%5B6kg%20or%2013kg%5D.%20Please%20advise.";

export default function LoyaltyOffer() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFB703 0%, #E85D04 100%)", padding: "48px 6%" }}
    >
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='white'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Loyalty card */}
          <div className="scroll-reveal bg-white rounded-[20px] p-7 hover-card transition-all duration-300 text-center">
            <div className="text-[2.5rem] mb-2">🎁</div>
            <h3 className="font-extrabold text-secondary text-[1.3rem] mb-1">Free Burner Replacement</h3>
            <p className="text-foreground/80 text-[0.9rem] italic mb-3">For Our Loyal Customers</p>
            <p className="text-foreground text-[0.88rem] leading-[1.7] mb-3">
              We appreciate every customer who keeps coming back. As a thank you, when your gas burner gets spoilt, we may offer you a FREE replacement burner — our way of saying thank you for your loyalty and trust.
            </p>
            <p className="text-muted-foreground italic text-[0.78rem] mb-5">
              * Offer available to frequent customers at our discretion. WhatsApp us to find out if you qualify.
            </p>
            <a
              href={WA_LOYALTY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-whatsapp text-whatsapp-foreground px-6 py-3 rounded-full font-bold text-sm wa-btn transition-all duration-250"
            >
              Ask About This Offer
            </a>
          </div>

          {/* Pricing card */}
          <div className="scroll-reveal bg-white rounded-[20px] p-7 hover-card transition-all duration-300 text-center" style={{ transitionDelay: "0.1s" }}>
            <div className="text-[2.5rem] mb-2">💰</div>
            <h3 className="font-extrabold text-secondary text-[1.3rem] mb-1">Always Competitive Prices</h3>
            <p className="text-foreground/80 text-[0.9rem] italic mb-3">Updated Every Day</p>
            <p className="text-foreground text-[0.88rem] leading-[1.7] mb-5">
              Gas prices change regularly and we make sure ours stay among the best in Karatina and its environs. We supply all brands at competitive prices — whether you need 6kg for home or 13kg for your restaurant.
            </p>
            <a
              href={WA_PRICE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm hover:bg-[#c94e00] hover:-translate-y-[2px] transition-all duration-250"
            >
              WhatsApp for Today's Price
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
