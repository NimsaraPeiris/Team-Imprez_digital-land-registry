"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/contexts/translation-context"
import LoginOverlay from "./login-overlay"

export default function HeroSection() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()
  const { t } = useTranslation()

  const handleNewUserClick = () => {
    router.push("/register")
  }

  const handleSignOut = () => {
    logout()
  }


  return (
    <section className="relative bg-[#003761] overflow-hidden" data-section="home">
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
              {t('hero.welcomeTitle')}
              <br />
              {t('hero.departmentName')}
            </h1>

            <p className="text-white text-base lg:text-lg font-medium leading-relaxed mb-8">
              {t('hero.description')}
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleNewUserClick}
                  className="bg-[#4490CC] text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-[#3a7bb8] transition-colors border border-[#4490CC]"
                >
                  {t('hero.newUser')}
                </button>
                <button
                  onClick={() => setIsOverlayOpen(true)}
                  className="bg-transparent text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-white/10 transition-colors border border-white"
                >
                  {t('hero.currentUser')}
                </button>
              </div>
            )}

            {isAuthenticated && user && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-lg font-medium">{t('hero.welcomeBack')} {user.id}</p>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-red-700 transition-colors"
                  >
                    {t('hero.signOut')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </section>
  )
}
