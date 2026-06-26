const WA_CTA = "https://wa.me/254722446378?text=Hi%21%20I%27m%20running%20low%20on%20gas.%20Can%20you%20deliver%20to%20me%20today%3F";

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #E85D04 0%, #c94e00 100%)" }}>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='white'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      <div className="container mx-auto px-4 text-center relative z-10 scroll-reveal">
        <h2 className="font-extrabold text-white mb-4" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
          Running Low on Gas?
        </h2>
        <p className="text-white/88 text-[1.05rem] max-w-lg mx-auto mb-8">
          We stock all brands at competitive prices. Serving Karatina and its environs. Open Mon–Sat 6am–10pm. Sunday 7–10am and 2–10pm.
        </p>
        <a
          href={WA_CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-primary px-8 py-4 rounded-full text-lg font-extrabold hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-250"
        >
          💬 WhatsApp Us Now — 0722 446 378
        </a>
      </div>
    </section>
  );
}
