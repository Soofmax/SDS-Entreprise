import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { FranceNumSection } from '@/components/sections/FranceNumSection';
import { PricingSection } from '@/components/sections/PricingSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FranceNumSection />
      <PricingSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
      <CartSidebar />
    </>
  );
}

