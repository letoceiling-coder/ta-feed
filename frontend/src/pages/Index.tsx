import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NewListingsSection from "@/components/NewListingsSection";
import CatalogSection from "@/components/CatalogSection";
import QuizWidget from "@/components/QuizWidget";
import HotDealsSection from "@/components/HotDealsSection";
import SalesStartSection from "@/components/SalesStartSection";
import AboutPlatformSection from "@/components/AboutPlatformSection";
import AdditionalFeaturesSection from "@/components/AdditionalFeaturesSection";
import LatestNewsSection from "@/components/LatestNewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <NewListingsSection />
      <CatalogSection />
      <QuizWidget />
      <HotDealsSection />
      <SalesStartSection />
      <AboutPlatformSection />
      <AdditionalFeaturesSection />
      <LatestNewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
