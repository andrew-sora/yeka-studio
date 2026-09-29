import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import WisudaSection from '@/components/WisudaSection';
import WeddingSection from '@/components/WeddingSection';
import AboutSection from '@/components/AboutSection';
import AvailabilitySection from '@/components/AvailabilitySection';
import TestimonialSection from '@/components/TestimonialSection';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <WisudaSection />
      <WeddingSection />
      <AboutSection />
      <AvailabilitySection />
      <TestimonialSection />
      <FaqSection />
      <ContactSection />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
