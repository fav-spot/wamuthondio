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

export default function BrandsAvailable() {
  const { brands } = useBrands({ onlyActive: true });

  return (
    <section id="brands" className="py-16 sm:py-24 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">
            What We Sell
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground mt-2 mb-4">
            Available Brands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tap your preferred brand to order it instantly on WhatsApp. We will confirm availability right away.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
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
                boxShadow: `0 12px 30px -5px ${b.brand_colour}50`,
                borderColor: b.brand_colour 
              }}
              className="group relative flex items-center justify-center h-24 sm:h-28 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors duration-300 overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: b.brand_colour }}
              />
              {/* Left edge color accent */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: b.brand_colour }}
              />
              <span 
                className="font-extrabold text-lg sm:text-xl relative z-10 text-gray-800 transition-colors"
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
            className="flex items-center justify-center h-24 sm:h-28 bg-gray-50/50 border-2 border-gray-200 border-dashed rounded-2xl text-gray-500 font-semibold hover:bg-orange-50 hover:text-primary hover:border-primary hover:border-solid transition-all duration-300"
          >
            + Other brand
          </motion.a>
        </div>
      </div>
    </section>
  );
}
