"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/contexts/translation-context"
import { useState, useEffect } from "react"
import { useSmoothScroll, getActiveSection } from "@/lib/use-smooth-scroll"

export default function DashboardNavigationBar() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState("Home")
  const { scrollToSection } = useSmoothScroll()
  
  // Dashboard specific navigation items with translations
  const navItems = [
    { label: t('nav.home'), section: "home" },
    { label: t('nav.services'), section: "services" },
    { label: t('nav.contact'), section: "contact" }
  ]

  // Handle navigation clicks
  const handleNavigation = (item: { label: string; section: string }) => {
    console.log(`Dashboard Navigation clicked: ${item.label}`)

    if (item.section === "home") {
      router.push('/') // Navigate to main home page
      return
    }

    if (item.section === "contact") {
      // Scroll to footer section
      const footerElement = document.querySelector('footer')
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(item.label)
      }
      return
    }

    // All other dashboard navigation scrolls normally
    scrollToSection(item.section)
    setActiveSection(item.label)
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

        {/* User greeting */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-blue-100 text-sm font-medium">
              {t('dashboard.welcome')}, {user.name || user.id}
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
