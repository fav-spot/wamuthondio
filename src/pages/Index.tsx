import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import BrandsAvailable from "@/components/BrandsAvailable";
import ProductSection from "@/components/ProductSection";
import AccessoriesSection from "@/components/AccessoriesSection";
import RefillingGuide from "@/components/RefillingGuide";
import HowToOrder from "@/components/HowToOrder";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import LoyaltyOffer from "@/components/LoyaltyOffer";
import AboutSection from "@/components/AboutSection";
import CtaBanner from "@/components/CtaBanner";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MobileStickyBar from "@/components/MobileStickyBar";
import { usePageTitle } from "@/hooks/usePageTitle";

const Index = () => {
  usePageTitle("Wamuthondio Cooking Gas Supply — Karatina");
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef}>
      <Navbar />
      <HeroSection />
      <TrustBar />
      <BrandsAvailable />
      <ProductSection />
      <AccessoriesSection />
      <RefillingGuide />
      <HowToOrder />
      <WhyChooseUs />
      <TestimonialsSection />
      <LoyaltyOffer />
      <AboutSection />
      <CtaBanner />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
      <MobileStickyBar />
    </div>
  );
};

export default Index;
