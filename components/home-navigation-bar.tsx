"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/contexts/translation-context"
import { useState, useEffect } from "react"
import LoginOverlay from "./login-overlay"
import { useSmoothScroll, getActiveSection } from "@/lib/use-smooth-scroll"

export default function HomeNavigationBar() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("Home")
  const { scrollToSection } = useSmoothScroll()

  // Home page navigation items with translations
  const navItems = [
    { label: t('nav.home'), section: "home" },
    { label: t('nav.services'), section: "services" },
    { label: t('nav.about'), section: "about" },
    { label: t('nav.news'), section: "announcements" },
    { label: t('nav.faq'), section: "faq" },
    { label: t('nav.contact'), section: "contact" }
  ]

  // Handle dashboard navigation
  const handleDashboardNavigation = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      // Show login modal for unauthenticated users
      setIsLoginModalOpen(true)
    }
  }

  // Handle navigation clicks
  const handleNavigation = (item: { label: string; section: string }) => {
    console.log(`Home Navigation clicked: ${item.label}, Authenticated: ${isAuthenticated}`)

    // Handle Home navigation
    if (item.section === "home") {
      scrollToSection(item.section)
      setActiveSection(item.label)
      return
    }

    // Handle Services navigation
    if (item.section === "services") {
      // Always scroll to services section on home page
      scrollToSection(item.section)
      setActiveSection(item.label)
      return
    }

    // Handle other public sections - scroll to them
    const publicSections = ["contact", "announcements", "faq", "about"]
    if (publicSections.includes(item.section)) {
      scrollToSection(item.section)
      setActiveSection(item.label)
      return
    }

    // Fallback
    console.log("Unknown navigation item")
  }

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        ...item,
        element: document.querySelector(`[data-section="${item.section}"]`)
      }))

      const activeSectionId = getActiveSection(sections)
      if (activeSectionId) {
        const activeItem = navItems.find(item => item.section === activeSectionId)
        if (activeItem) {
          setActiveSection(activeItem.label)
        }
      }
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll() // Set initial active section
    
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  return (
    <>
      <nav className="w-full bg-[#4490CC] py-3">
        <div className="flex items-center justify-between px-[85px]">
          {/* Navigation items */}
          <div className="flex items-center gap-11">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className={`text-xl font-medium leading-6 transition-all duration-200 ${
                  activeSection === item.label
                    ? "text-white font-semibold"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Dashboard button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleDashboardNavigation}
              className="bg-white text-[#4490CC] px-6 py-2 rounded-md font-semibold text-sm hover:bg-blue-50 transition-colors duration-200 shadow-sm"
            >
              {isAuthenticated ? t('nav.dashboard') : t('nav.loginToDashboard')}
            </button>
          </div>
        </div>
      </nav>

      {isLoginModalOpen && <LoginOverlay isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />}
    </>
  )
}
