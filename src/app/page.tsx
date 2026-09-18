import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import WisudaSection from '@/components/WisudaSection';
import WeddingSection from '@/components/WeddingSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <WisudaSection />
      <WeddingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
