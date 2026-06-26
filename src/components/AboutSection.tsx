import { useState, useEffect, useCallback } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import gassesMixed from "@/assets/gasses-mixed.png";
import kgas6 from "@/assets/kgas-6kg.png";
import afrigas6 from "@/assets/afrigas-6kg.png";
import burner1 from "@/assets/burner-1.png";
import { useMediaSection } from "@/hooks/useMediaSection";

const staticPhotos = [heroBg, gassesMixed, kgas6, afrigas6, burner1];

const checks = [
  "Serving Karatina and its environs",
  "All major brands stocked",
  "Refills and new cylinders available",
  "Mon–Sat 6am–10pm · Sun 7–10am & 2–10pm",
];

export default function AboutSection() {
  const { items } = useMediaSection("About Carousel");
  const photos = items.length ? items.map((i) => i.file_url) : staticPhotos;
  const altTexts = items.length ? items.map((i) => i.alt_text || "Shop photo") : staticPhotos.map((_, i) => `Shop photo ${i + 1}`);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (current >= photos.length) setCurrent(0);
  }, [photos.length, current]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <div
            className="scroll-reveal relative rounded-[32px] overflow-hidden h-[450px] group shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-gradient-to-b from-gray-50 to-gray-200 border border-gray-200/50"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {photos.map((src, i) => {
              // If it's a transparent PNG asset, we want it to be contained nicely so it doesn't look stretched or like a placeholder.
              // If it's a real photo (like heroBg), object-cover is better.
              const isPng = src.includes('.png') && !src.includes('hero-bg');
              
              return (
                <div 
                  key={i} 
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 flex items-center justify-center p-8 ${
                    i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {/* Soft radial glow behind transparent PNGs to make them pop */}
                  {isPng && <div className="absolute inset-0 bg-gradient-to-t from-gray-300/30 to-transparent pointer-events-none" />}
                  
                  <img
                    src={src}
                    alt={altTexts[i] ?? `Shop photo ${i + 1}`}
                    className={`w-full h-full transition-transform duration-700 group-hover:scale-105 drop-shadow-xl ${isPng ? 'object-contain' : 'object-cover absolute inset-0 !p-0'}`}
                  />
                </div>
              );
            })}

            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full p-2.5 transition z-20 shadow-lg" aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full p-2.5 transition z-20 shadow-lg" aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125 w-4" : "bg-white/60"}`}
                />
              ))}
            </div>

            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md text-[#0F1F3D] rounded-2xl px-5 py-3 z-20 shadow-xl border border-white">
              <p className="font-extrabold text-sm flex items-center gap-2">🏍️ Delivering Gas</p>
              <p className="text-xs font-bold text-gray-500 mt-0.5">Karatina and Beyond</p>
            </div>
          </div>

          <div className="scroll-reveal" style={{ transitionDelay: "0.15s" }}>
            <span className="text-[#FFB703] font-bold text-[0.85rem] uppercase tracking-widest drop-shadow-sm">Our Story</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0F1F3D] mt-3 mb-6 leading-tight">
              Born in Karatina. Built for Karatina.
            </h2>
            <div className="space-y-4 text-gray-600 text-[1.05rem] leading-relaxed mb-8">
              <p>
                Wamuthondio Cooking Gas Supply has been serving households, restaurants, and businesses in Karatina, Nyeri County for years. We started with one goal — make sure no family ever runs out of cooking gas.
              </p>
              <p>
                We deliver by motorcycle directly to your door, fast, safe, and at honest prices. We stock all major brands in both 6kg and 13kg sizes, plus burners and regulators.
              </p>
              <p className="font-semibold text-gray-800">
                When you order from Wamuthondio, you are supporting a local business that genuinely cares about this community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {checks.map((c) => (
                <div key={c} className="flex items-center gap-3 text-sm text-[#0F1F3D] bg-gray-50 border border-gray-100 p-3 rounded-xl shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#E85D04]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#E85D04]" strokeWidth={3} />
                  </div>
                  <span className="font-bold">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
