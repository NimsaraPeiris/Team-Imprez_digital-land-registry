"use client"

import { useAuth } from "@/contexts/auth-context"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ServiceDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const services = [
    {
      id: 1,
      title: "Land Transfer",
      description:
        "Register the transfer of land ownership from the seller to the buyer with full legal documentation and verification.",
      iconPath: "/service.png",
    },
    {
      id: 2,
      title: "Application for Copy of Land Regs",
      description:
        "Request an officially certified copy of land records for legal, administrative, or personal reference purposes.",
      iconPath: "/service.png",
    },
    {
      id: 3,
      title: "Application for Search of Land Registers",
      description:
        "Conduct a search in the official land registry to verify ownership details, boundaries, and encumbrances.",
      iconPath: "/service.png",
    },
    {
      id: 4,
      title: "Application for search Duplicate of Deeds",
      description: "Locate and review registered land records to confirm property history and registration details.",
      iconPath: "/service.png",
    },
    {
      id: 5,
      title: "Application for copy",
      description: "Request a duplicate copy of a registered deed when the original document has been lost or damaged.",
      iconPath: "/service.png",
    },
  ]

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const handleServiceClick = (serviceId: number) => {
    if (serviceId === 1) {
      router.push("/land-transfer")
    } else if (serviceId === 3) {
      router.push("/search-land")
    } else if (serviceId === 4) {
      router.push("/search-duplicate-deeds")
    } else if (serviceId === 5) {
      router.push("/copy")
    } else if (serviceId === 2) {
      router.push("/copy-of-land")
    }
    // Add more service navigation logic here for other services
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      {/* Dashboard content */}
      <main className="py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div
          className="bg-[#102A3D] rounded-lg mb-12 p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center"
          data-section="home"
        >
          <div>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Welcome, {user?.name || "User"}
            </h1>
            <div className="mt-4 text-white text-sm sm:text-base">
              <p className="font-bold">{user?.requesterType || "Individual"}</p>
              <p>
                {user?.registrationOffice || "Registration Office"} | {user?.email || "No email provided"}
              </p>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 text-white text-sm sm:text-base text-left sm:text-right">
            <span className="font-extrabold">Today</span>
            <br />
            <span className="font-normal">{currentDate}</span>
          </div>
        </div>

        <div className="mb-8" data-section="services">
          <h2 className="text-black text-xl sm:text-2xl font-medium leading-tight">Available Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg border border-[#807E7E] shadow-md p-6 flex flex-col h-full"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white rounded-md border border-[#4090CE] flex items-center justify-center mr-4 flex-shrink-0">
                  <img src={service.iconPath || "/continue.png"} alt={service.title} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-black leading-tight">{service.title}</h3>
              </div>
              <p className="text-[#797979] text-sm font-medium leading-relaxed mb-6 flex-grow">{service.description}</p>
              <div
                onClick={() => handleServiceClick(service.id)}
                className="bg-[#102A3D] rounded-lg flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-[#0b3d5c] transition-colors mt-auto"
              >
                <span className="text-white text-base font-medium">Request Application</span>
                <img src="/continue.png" alt="Arrow" className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 right-8 w-14 h-14 bg-[#4490CC] rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#3a7bb8] transition-colors">
          <Plus size={32} className="text-white" />
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  )
}
