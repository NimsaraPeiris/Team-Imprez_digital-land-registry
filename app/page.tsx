import GovernmentHeader from "@/components/government-header"
import NavigationBar from "@/components/navigation-bar"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProcessSection from "@/components/process-section"
import AnnouncementsSection from "@/components/announcements-section"
import FAQSection from "@/components/faq-section"
import ContactSection from "@/components/contact-section"
// Added footer import
import Footer from "@/components/footer"

const Page = () => {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <NavigationBar />
      </div>
      <div className="relative">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <AnnouncementsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  )
}

export default Page
