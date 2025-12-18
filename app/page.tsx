import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import BrandsMarquee from '@/components/BrandsMarquee'
import EditorSection from '@/components/EditorSection'
import AnalyticsSection from '@/components/AnalyticsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BrandsMarquee />
      <EditorSection />
      <AnalyticsSection />
      <CTASection />
      <Footer />
    </>
  )
}
