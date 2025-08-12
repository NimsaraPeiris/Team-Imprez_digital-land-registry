"use client"

import { useAuth } from "@/contexts/auth-context"
import GovernmentHeader from "@/components/government-header"
import NavigationBar from "@/components/navigation-bar"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { Plus } from "lucide-react"

export default function ServiceDashboard() {
  const { user } = useAuth()

  const services = [
    {
      id: 1,
      title: "Land Transfer",
      description:
        "Register the transfer of land ownership from the seller to the buyer with full legal documentation and verification.",
      iconPath: "/land-transfer-icon.png",
    },
    {
      id: 2,
      title: "Application for a certified copy of a land",
      description:
        "Request an officially certified copy of land records for legal, administrative, or personal reference purposes.",
      iconPath: "/certified-copy-icon.png",
    },
    {
      id: 3,
      title: "Application for search of land registers",
      description:
        "Conduct a search in the official land registry to verify ownership details, boundaries, and encumbrances.",
      iconPath: "/search-registers-icon.png",
    },
    {
      id: 4,
      title: "Application for search of land registers",
      description: "Locate and review registered land records to confirm property history and registration details.",
      iconPath: "/search-registers-icon.png",
    },
    {
      id: 5,
      title: "Application for search duplicate of deeds",
      description: "Request a duplicate copy of a registered deed when the original document has been lost or damaged.",
      iconPath: "/duplicate-deeds-icon.png",
    },
  ]

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <NavigationBar />
      </div>

      {/* Dashboard content */}
      <main className="py-16 px-[75px]">
        <div className="w-[1291px] h-[212px] bg-[#102A3D] rounded-[9px] mb-[111px] relative">
          <div className="absolute left-[23px] top-[43px] text-white text-[35px] font-bold leading-[42px]">
            Welcome, {user?.name || "User"}
          </div>
          <div className="absolute left-[32px] top-[118px] text-white text-[16px] font-bold leading-[19.2px]">
            {user?.requesterType || "Individual"}
          </div>
          <div className="absolute left-[32px] top-[144px] text-white text-[16px] font-normal leading-[19.2px]">
            {user?.registrationOffice || "Registration Office"} | {user?.email || "No email provided"}
          </div>
          <div className="absolute right-[32px] top-[126px] text-white text-[16px] leading-[24px]">
            <span className="font-extrabold">Today</span>
            <br />
            <span className="font-normal">{currentDate}</span>
          </div>
        </div>

        <div className="mb-[21px]">
          <h2 className="text-black text-[23px] font-medium leading-[27.6px]">Available Services</h2>
        </div>

        <div className="flex flex-col gap-[21px]">
          {/* Top row - 2 cards */}
          <div className="flex gap-[41px]">
            {services.slice(0, 2).map((service, index) => {
              return (
                <div
                  key={service.id}
                  className="w-[625px] h-[302px] bg-white rounded-[4px] border-[0.4px] border-[#807E7E] shadow-[0px_0px_11.5px_rgba(0,0,0,0.05)] relative"
                >
                  <div className="absolute left-[32px] top-[47px] w-[555px] h-[199px]">
                    {/* Icon */}
                    <div className="w-[34px] h-[34px] bg-white rounded-[4px] border-[0.5px] border-[#4090CE] flex items-center justify-center">
                      <div className="w-[22px] h-[21px] bg-[#4490CC] rounded flex items-center justify-center">
                        <img src={service.iconPath || "/placeholder.svg"} alt={service.title} className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute top-[55px] text-black text-[20px] font-medium leading-[24px] w-[555px]">
                      {service.title}
                    </div>

                    {/* Description */}
                    <div className="absolute top-[100px] text-[#797979] text-[15px] font-medium leading-[18px] w-[555px]">
                      {service.description}
                    </div>

                    {/* Button */}
                    <div className="absolute top-[157px] w-[555px] h-[42px] bg-[#102A3D] rounded-[9px] flex items-center justify-between px-[23px] cursor-pointer hover:bg-[#0d1f2a] transition-colors">
                      <span className="text-white text-[20px] font-medium leading-[24px]">Request Application</span>
                      <div className="w-[28px] h-[17px] bg-white rounded flex items-center justify-center">
                        <img src="/dashboard-arrow-icon.png" alt="Arrow" className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Second row - 2 cards */}
          <div className="flex gap-[41px]">
            {services.slice(2, 4).map((service, index) => {
              return (
                <div
                  key={service.id}
                  className="w-[625px] h-[302px] bg-white rounded-[4px] border-[0.4px] border-[#807E7E] shadow-[0px_0px_11.5px_rgba(0,0,0,0.05)] relative"
                >
                  <div className="absolute left-[32px] top-[47px] w-[555px] h-[199px]">
                    {/* Icon */}
                    <div className="w-[34px] h-[34px] bg-white rounded-[4px] border-[0.5px] border-[#4090CE] flex items-center justify-center">
                      <div className="w-[22px] h-[21px] bg-[#4490CC] rounded flex items-center justify-center">
                        <img src={service.iconPath || "/placeholder.svg"} alt={service.title} className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute top-[55px] text-black text-[20px] font-medium leading-[24px] w-[555px]">
                      {service.title}
                    </div>

                    {/* Description */}
                    <div className="absolute top-[100px] text-[#797979] text-[15px] font-medium leading-[18px] w-[555px]">
                      {service.description}
                    </div>

                    {/* Button */}
                    <div className="absolute top-[157px] w-[555px] h-[42px] bg-[#102A3D] rounded-[9px] flex items-center justify-between px-[23px] cursor-pointer hover:bg-[#0d1f2a] transition-colors">
                      <span className="text-white text-[20px] font-medium leading-[24px]">Request Application</span>
                      <div className="w-[28px] h-[17px] bg-white rounded flex items-center justify-center">
                        <img src="/dashboard-arrow-icon.png" alt="Arrow" className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Third row - 1 card */}
          <div className="flex">
            {services.slice(4, 5).map((service, index) => {
              return (
                <div
                  key={service.id}
                  className="w-[625px] h-[302px] bg-white rounded-[4px] border-[0.4px] border-[#807E7E] shadow-[0px_0px_11.5px_rgba(0,0,0,0.05)] relative"
                >
                  <div className="absolute left-[32px] top-[47px] w-[555px] h-[199px]">
                    {/* Icon */}
                    <div className="w-[34px] h-[34px] bg-white rounded-[4px] border-[0.5px] border-[#4090CE] flex items-center justify-center">
                      <div className="w-[22px] h-[21px] bg-[#4490CC] rounded flex items-center justify-center">
                        <img src={service.iconPath || "/placeholder.svg"} alt={service.title} className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute top-[55px] text-black text-[20px] font-medium leading-[24px] w-[555px]">
                      {service.title}
                    </div>

                    {/* Description */}
                    <div className="absolute top-[100px] text-[#797979] text-[15px] font-medium leading-[18px] w-[555px]">
                      {service.description}
                    </div>

                    {/* Button */}
                    <div className="absolute top-[157px] w-[555px] h-[42px] bg-[#102A3D] rounded-[9px] flex items-center justify-between px-[23px] cursor-pointer hover:bg-[#0d1f2a] transition-colors">
                      <span className="text-white text-[20px] font-medium leading-[24px]">Request Application</span>
                      <div className="w-[28px] h-[17px] bg-white rounded flex items-center justify-center">
                        <img src="/dashboard-arrow-icon.png" alt="Arrow" className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="fixed bottom-[50px] right-[50px] w-[52px] h-[52px] bg-[#4490CC] rounded-full shadow-[0px_4px_33.1px_rgba(20.49,78.20,14.08,0.25)] flex items-center justify-center cursor-pointer hover:bg-[#3a7bb8] transition-colors">
          <Plus size={28} className="text-white" />
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  )
}
