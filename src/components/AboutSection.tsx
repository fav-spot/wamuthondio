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
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div
            className="scroll-reveal relative rounded-[24px] overflow-hidden h-[420px] group"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={altTexts[i] ?? `Shop photo ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03] ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition z-10" aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition z-10" aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>

            <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground rounded-[16px] px-4 py-3 z-10">
              <p className="font-bold text-sm">🏍️ Delivering Gas</p>
              <p className="text-xs opacity-90">Karatina and Beyond</p>
            </div>
          </div>

          <div className="scroll-reveal" style={{ transitionDelay: "0.15s" }}>
            <span className="text-primary font-bold text-[0.78rem] uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-6">
              Born in Karatina. Built for Karatina.
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed mb-6">
              <p>
                Wamuthondio Cooking Gas Supply has been serving households, restaurants, and businesses in Karatina, Nyeri County for years. We started with one goal — make sure no family ever runs out of cooking gas.
              </p>
              <p>
                We deliver by motorcycle directly to your door, fast, safe, and at honest prices. We stock K-Gas, Total Gas, Pro-Gas, and Afri-Gas in both 6kg and 13kg sizes, plus burners and regulators.
              </p>
              <p>
                When you order from Wamuthondio, you are supporting a local business that genuinely cares about this community.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {checks.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
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
