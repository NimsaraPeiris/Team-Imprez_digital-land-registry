"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function CopyOfLandPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleBackToService = () => {
    router.push("/dashboard")
  }

  const handleStartApplication = () => {
    router.push("/copy-of-land/application")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      <main className="py-8 px-[75px]">
        {/* Header Section */}
        <div className="w-[1291px] h-[151px] bg-[#102A3D] rounded-[9px] mb-[20px] relative">
          <div className="absolute left-[23px] top-[43px] flex flex-col gap-[5px]">
            <h1 className="text-white text-[35px] font-bold leading-[42px] font-inter">
              Application for Copy of Land Regs
            </h1>
            <p className="text-white text-[16px] font-light leading-[19.2px] font-inter">
              Request a copy of land documents
            </p>
          </div>
        </div>

        {/* Tutorial Video Section */}
        <div className="w-[1284px] h-[374px] rounded-[24px] border border-[#DAD7D7] mb-[20px] relative overflow-hidden">
          <div className="absolute left-[44px] top-[35px] w-[646px] h-[304px] bg-[#8C8C8C] rounded-[8px] relative overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Copy of Land Tutorial"
              className="w-full h-full rounded-[8px]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="absolute left-[731px] top-[140px]">
            <h2 className="text-black text-[23px] font-semibold leading-[27.6px] font-inter mb-[77px]">
              How to
              <br />
              Request a Copy of Land
            </h2>
            <p className="text-[#626262] text-[16px] font-normal leading-[19.2px] font-inter">
              Watch this tutorial to understand the complete process (8:45)
            </p>
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="w-[1284px] rounded-[36px] border border-[#DAD7D7] mb-[20px] relative overflow-hidden">
          <div className="p-[36px]">

            {/* Action Buttons */}
            <div className="flex items-center gap-[10px]">
              <button
                onClick={handleStartApplication}
                className="w-[350px] h-[62px] bg-[#4490CC] hover:bg-[#3a7bb8] text-white rounded-[10px] flex items-center justify-center transition-all duration-200"
              >
                <span className="text-[24px] font-semibold leading-[28.8px] font-inter">
                  Start Application
                </span>
              </button>
              <button
                onClick={handleBackToService}
                className="w-[350px] h-[62px] bg-white border border-[#00508E] rounded-[10px] flex items-center justify-center hover:bg-blue-50 transition-colors"
              >
                <span className="text-[#00508E] text-[24px] font-normal leading-[28.8px] font-inter">
                  Back to Service
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="w-[819px] mb-[20px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[5px]">
              <h3 className="text-black text-[20px] font-medium font-inter">Need Help ?</h3>
              <p className="text-[#767676] text-[20px] font-medium font-inter">
                Our support team is available to assist with your copy of land applications.
              </p>
            </div>
            <div className="flex items-center gap-[17px]">
              <button className="w-[150px] h-[42px] border border-black rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="text-black text-[16px] font-medium font-inter">Contact Support</span>
              </button>
              <button className="w-[83px] h-[42px] border border-black rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="text-black text-[16px] font-medium font-inter">FAQ</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  )
}
