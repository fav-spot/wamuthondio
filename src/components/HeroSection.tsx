import { Phone } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import { useMediaSection } from "@/hooks/useMediaSection";
import { motion } from "framer-motion";

const WA_ORDER = "https://wa.me/254722446378?text=Hi%21%20I%27d%20like%20to%20order%20gas%20from%20Wamuthondio.%20Please%20help%20me.";

const badges = [
  { label: "Competitive Prices Daily", icon: "✅" },
  { label: "All Gas Brands in Stock", icon: "🛢️" },
  { label: "Karatina and Environs", icon: "📍" },
  { label: "Licensed Supplier", icon: "✔" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection() {
  const { items } = useMediaSection("Hero");
  const heroImg = items[0]?.file_url ?? heroBg;
  const heroAlt = items[0]?.alt_text ?? "Wamuthondio Cooking Gas Supply hero background";

  return (
    <section id="home" className="relative min-h-screen flex items-end sm:items-center overflow-hidden" style={{ paddingTop: 68 }}>
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
        role="img"
        aria-label={heroAlt}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(105deg, rgba(15,31,61,0.92) 0%, rgba(15,31,61,0.7) 45%, rgba(232,93,4,0.4) 100%)" }}
      />

      <motion.div 
        className="relative z-10 w-full max-w-[700px] px-[6%] py-12 sm:py-16 mt-12 sm:mt-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-r-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full text-accent uppercase text-[0.78rem] font-bold tracking-[0.08em] px-4 py-1.5 mb-6 backdrop-blur-md bg-white/10 border border-white/20 shadow-inner"
        >
          📍 Karatina, Nyeri County
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-extrabold text-white leading-[1.08] mb-4 drop-shadow-md"
          style={{ fontSize: "clamp(2.6rem, 6.5vw, 4rem)" }}
        >
          Fast Gas Delivery in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB703] to-[#E85D04]">Karatina</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-[1.1rem] leading-[1.65] mb-8 text-white/90 drop-shadow"
        >
          All gas brands. Competitive prices. We deliver to Karatina and its environs — just call or WhatsApp.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={WA_ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white px-8 py-4 rounded-full text-lg font-bold shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order on WhatsApp
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.03, y: -2, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            href="tel:+254722446378"
            className="inline-flex items-center justify-center gap-2 border border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-bold transition-all"
          >
            <Phone className="w-5 h-5" />
            Call Us Now
          </motion.a>
        </motion.div>

        <motion.div variants={containerVariants} className="flex flex-wrap gap-3">
          {badges.map((b) => (
            <motion.span
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              key={b.label}
              className="inline-flex items-center gap-2 text-white text-[0.82rem] font-medium px-4 py-2 rounded-full border border-white/20 backdrop-blur-md bg-white/10 shadow-sm"
            >
              {b.icon} {b.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
