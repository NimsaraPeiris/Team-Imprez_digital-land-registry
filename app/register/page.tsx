"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import NavigationBar from "@/components/navigation-bar"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { ChevronDown } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    id: "",
    requesterType: "",
    registrationOffice: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBack = () => {
    router.back()
  }

  const handleContinue = () => {
    // Handle form submission
    console.log("Form data:", formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <NavigationBar />
      </div>

      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h1 className="text-xl font-extrabold text-black leading-6">
                Enter Your details: <span className="font-normal">For Registration</span>
              </h1>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                <div className="space-y-2">
                  <label className="block text-black text-sm font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    placeholder="Enter seller's full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-black text-sm font-semibold">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                <div className="space-y-2">
                  <label className="block text-black text-sm font-semibold">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    placeholder="+000 000 0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-black text-sm font-semibold">Id</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    className="w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    placeholder="XXXXXXXXXXXXXXV"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                <div className="space-y-2">
                  <label className="block text-black text-sm font-semibold">Requester Type</label>
                  <div className="relative">
                    <select
                      value={formData.requesterType}
                      onChange={(e) => handleInputChange("requesterType", e.target.value)}
                      className="w-full h-10 px-5 bg-white rounded-lg border border-[#B2ACAC] text-sm text-[#413F3F] appearance-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    >
                      <option value="">Requester Type</option>
                      <option value="individual">Individual</option>
                      <option value="organization">Organization</option>
                      <option value="government">Government Entity</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#413F3F] pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-black text-sm font-semibold">Nearest Registration Office</label>
                  <div className="relative">
                    <select
                      value={formData.registrationOffice}
                      onChange={(e) => handleInputChange("registrationOffice", e.target.value)}
                      className="w-full h-10 px-5 bg-white rounded-lg border border-[#B2ACAC] text-sm text-[#413F3F] appearance-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    >
                      <option value="">Nearest Registration Office</option>
                      <option value="colombo">Colombo Registration Office</option>
                      <option value="kandy">Kandy Registration Office</option>
                      <option value="galle">Galle Registration Office</option>
                      <option value="jaffna">Jaffna Registration Office</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#413F3F] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 bg-white border border-[#00508E] rounded-lg text-black text-base font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-5 py-3 bg-[#002E51] text-white rounded-lg text-base font-medium hover:bg-[#001a2e] transition-colors flex items-center gap-3"
                >
                  Continue
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <img src="/continue.png" alt="Continue arrow" className="w-3 h-3" />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  )
}
