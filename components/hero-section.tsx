"use client"

import Image from "next/image"
import { useState } from "react"
import LoginOverlay from "./login-overlay"

export default function HeroSection() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  return (
    <section className="relative bg-[#003761] overflow-hidden">
      <div className="relative min-h-[500px] flex items-center">
        {/* Background image on the right */}
        <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full ">
          <Image
            src="/land-registration-office.png"
            alt="Department of Land Registration building"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-20 py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-white text-2xl lg:text-4xl font-medium leading-tight mb-6">
              Welcome To the
              <br />
              Department of Land Registration
            </h1>

            <p className="text-white text-base lg:text-lg font-medium leading-relaxed mb-8">
              Register land, verify titles, transfer ownership, and access maps and records online. Our mission is to
              protect property rights with accuracy and integrity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#4490CC] text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-[#3a7bb8] transition-colors border border-[#4490CC]">
                New User
              </button>
              <button
                onClick={() => setIsOverlayOpen(true)}
                className="bg-transparent text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-white/10 transition-colors border border-white"
              >
                Current User
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoginOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </section>
  )
}
