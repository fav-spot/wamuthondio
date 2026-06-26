const WA_LOYALTY = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20ask%20about%20the%20free%20burner%20replacement%20offer%20for%20loyal%20customers.";
const WA_PRICE = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20know%20today%27s%20gas%20price%20for%20%5B6kg%20or%2013kg%5D.%20Please%20advise.";

export default function LoyaltyOffer() {
  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "linear-gradient(135deg, #0F1F3D 0%, #1a365d 100%)" }}
    >
      {/* Decorative premium background elements */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23FFFFFF' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFB703] to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E85D04] to-transparent opacity-30" />

      <div className="container mx-auto relative z-10 px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Loyalty card */}
          <div className="scroll-reveal bg-white/5 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 border border-white/10 hover:bg-white/10 transition-all duration-500 text-center shadow-2xl relative group">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#FFB703] to-[#E85D04] rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-[#0F1F3D] group-hover:scale-110 transition-transform duration-500">
              🎁
            </div>
            <h3 className="font-extrabold text-white text-2xl mt-4 mb-2">Free Burner Replacement</h3>
            <p className="text-[#FFB703] font-bold text-sm uppercase tracking-widest mb-6 drop-shadow-sm">For Our Loyal Customers</p>
            <p className="text-white/80 text-[1.05rem] leading-relaxed mb-6">
              We appreciate every customer who keeps coming back. As a thank you, when your gas burner gets spoilt, we may offer you a FREE replacement burner — our way of saying thank you for your loyalty and trust.
            </p>
            <p className="text-white/40 italic text-sm mb-8">
              * Offer available to frequent customers at our discretion. WhatsApp us to find out if you qualify.
            </p>
            <a
              href={WA_LOYALTY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FFB703] text-[#0F1F3D] hover:bg-white px-8 py-4 rounded-xl font-bold text-[1.05rem] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Ask About This Offer
            </a>
          </div>

          {/* Pricing card */}
          <div className="scroll-reveal bg-white/5 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 border border-white/10 hover:bg-white/10 transition-all duration-500 text-center shadow-2xl relative group" style={{ transitionDelay: "0.1s" }}>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#16A34A] to-[#15803d] rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-[#0F1F3D] group-hover:scale-110 transition-transform duration-500">
              💰
            </div>
            <h3 className="font-extrabold text-white text-2xl mt-4 mb-2">Always Competitive Prices</h3>
            <p className="text-[#16A34A] font-bold text-sm uppercase tracking-widest mb-6 drop-shadow-sm">Updated Every Day</p>
            <p className="text-white/80 text-[1.05rem] leading-relaxed mb-8 pb-8 border-b border-white/10">
              Gas prices change regularly and we make sure ours stay among the best in Karatina and its environs. We supply all brands at competitive prices — whether you need 6kg for home or 13kg for your restaurant.
            </p>
            <a
              href={WA_PRICE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#0F1F3D] hover:bg-[#16A34A] hover:text-white px-8 py-4 rounded-xl font-bold text-[1.05rem] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              WhatsApp for Today's Price
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
