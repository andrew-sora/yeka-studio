import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import AvailabilitySection from '@/components/AvailabilitySection';
import WisudaSection from '@/components/WisudaSection';
import WeddingSection from '@/components/WeddingSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <AvailabilitySection />
      <WisudaSection />
      <WeddingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}


