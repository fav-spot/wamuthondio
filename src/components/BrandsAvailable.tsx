import { useBrands } from "@/hooks/useBrands";
import { motion } from "framer-motion";

const WA = "https://wa.me/254722446378?text=";

function buildOrderMsg(brand: string) {
  return encodeURIComponent(
    `Hi! I'd like to order ${brand} from Wamuthondio. Please advise on availability (6kg or 13kg) and delivery.`
  );
}

const otherMsg = encodeURIComponent(
  "Hi! I'd like to order a gas brand not listed on your site. Please advise on availability."
);

import heroBg from "@/assets/hero-bg.png";

export default function BrandsAvailable() {
  const { brands } = useBrands({ onlyActive: true });

  return (
    <section id="brands" className="relative py-20 sm:py-28 overflow-hidden border-t border-gray-800">
      {/* Immersive Dark Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1F3D]/95 to-[#0F1F3D]/90" />
      
      <div className="relative container mx-auto px-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#FFB703] font-bold text-[0.8rem] uppercase tracking-widest">
            Complete Inventory
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4 drop-shadow-md">
            Available Brands
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Tap your preferred brand to order it instantly via WhatsApp. Fast, reliable, and always in stock.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {brands.map((b, i) => (
            <motion.a
              key={b.id}
              href={`${WA}${buildOrderMsg(b.brand_name)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: `0 20px 25px -5px ${b.brand_colour}30, 0 8px 10px -6px ${b.brand_colour}30`,
              }}
              className="group relative flex items-center justify-center h-28 sm:h-32 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ backgroundColor: b.brand_colour }}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: b.brand_colour }}
              />
              <span 
                className="font-extrabold text-lg sm:text-xl relative z-10 text-gray-700 group-hover:text-gray-900 transition-colors"
              >
                {b.brand_name}
              </span>
            </motion.a>
          ))}
          
          <motion.a
            href={`${WA}${otherMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex items-center justify-center h-28 sm:h-32 bg-transparent border-2 border-gray-200 border-dashed rounded-3xl text-gray-400 font-semibold hover:bg-orange-50 hover:text-[#E85D04] hover:border-[#E85D04] transition-all duration-300"
          >
            + Request Other
          </motion.a>
        </div>
      </div>
    </section>
  );
}
