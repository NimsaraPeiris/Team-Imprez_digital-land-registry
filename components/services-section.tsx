"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"
import LoginOverlay from "./login-overlay"

const services = [
  {
    id: 1,
    title: "Land Transfer",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    iconUrl: "/image 12.png",
    slug: "land-transfer",
  },
  {
    id: 2,
    title: "Application for Copy of Land Registers",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    iconUrl: "/image 12.png",
    slug: "copy-land-registers",
  },
  {
    id: 3,
    title: "Register Property",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    iconUrl: "/image 12.png",
    slug: "register-property",
  },
  {
    id: 4,
    title: "Register Property",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    iconUrl: "/image 12.png",
    slug: "register-property-2",
  },
  {
    id: 5,
    title: "Register Property",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    iconUrl: "/image 12.png",
    slug: "register-property-3",
  },
]

export default function ServicesSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleServiceClick = (service: (typeof services)[0]) => {
    if (isAuthenticated) {
      // Navigate to individual service page if authenticated
      router.push(`/services/${service.slug}`)
    } else {
      // Show login overlay if not authenticated
      setIsLoginOpen(true)
    }
  }

  return (
    <section className="bg-white py-16">
      <div className="w-full max-w-[1370px] mx-auto px-4 sm:px-6 lg:px-2">
        {/* Header */}
        <div className="flex justify-between items-start mb-[75px]">
          <div className="max-w-[542px]">
            <h2 className="text-[26px] font-semibold text-black mb-3 leading-[31.2px]">Services</h2>
            <p className="text-[20px] text-[#00508E] leading-6 font-normal">
              Explore our most-requested services and get started online.
            </p>
          </div>
          <div className="text-[20px] text-black hover:text-[#00508E] transition-colors duration-300 cursor-pointer leading-6 font-normal">
            View all Services
          </div>
        </div>

        <div className="space-y-[22px]">
          {/* Top row - 3 cards */}
          <div className="flex gap-[22px]">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="w-[442px] h-[152px] bg-white rounded-[11px] border border-[#E2E2E2] shadow-[0px_1px_6px_rgba(0,0,0,0.12)] hover:shadow-lg hover:shadow-blue-100 hover:border-[#ffffff] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute left-[21px] top-[17px] w-[35px] h-[44px] bg-[#ffffff] group-hover:bg-[#ffffff] transition-colors duration-300" />
                <Image
                  src={service.iconUrl || "/placeholder.svg"}
                  alt={service.title}
                  width={35}
                  height={35}
                  className="absolute left-[17px] top-[20px]"
                />
                <h3 className="absolute left-6 top-[67px] text-[20px] font-normal text-black group-hover:text-[#00508E] leading-6 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="absolute left-6 top-[100px] text-[13px] text-black leading-[15.6px] font-normal w-[390px]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom row - 2 cards */}
          <div className="flex gap-[22px]">
            {services.slice(3, 5).map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="w-[442px] h-[152px] bg-white rounded-[11px] border border-[#E2E2E2] shadow-[0px_1px_6px_rgba(0,0,0,0.12)] hover:shadow-lg hover:shadow-blue-100 hover:border-[#ffffff] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute left-[21px] top-[17px] w-[35px] h-[44px] bg-[#ffffff] group-hover:bg-[#ffffff] transition-colors duration-300" />
                <Image
                  src={service.iconUrl || "/placeholder.svg"}
                  alt={service.title}
                  width={35}
                  height={35}
                  className="absolute left-[17px] top-[20px]"
                />
                <h3 className="absolute left-6 top-[67px] text-[20px] font-normal text-black group-hover:text-[#00508E] leading-6 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="absolute left-6 top-[100px] text-[13px] text-black leading-[15.6px] font-normal w-[390px]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <LoginOverlay isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </section>
  )
}
