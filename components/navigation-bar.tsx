"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import LoginOverlay from "./login-overlay"

export default function NavigationBar() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const navItems = ["Home", "Services", "About us", "Contact Us", "News & Events", "FAQ"]

  const handleNavigation = (item: string) => {
    console.log(`Navigation clicked: ${item}, Authenticated: ${isAuthenticated}`) // Added debugging

    if (item === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (item === "Contact Us") {
      const contactSection = document.querySelector('[data-section="contact"]')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      } else {
        console.warn("Contact section not found") // Added error handling
      }
      return
    }

    if (item === "News & Events") {
      const announcementSection = document.querySelector('[data-section="announcements"]')
      if (announcementSection) {
        announcementSection.scrollIntoView({ behavior: "smooth" })
      } else {
        console.warn("Announcements section not found") // Added error handling
      }
      return
    }

    if (item === "FAQ") {
      const faqSection = document.querySelector('[data-section="faq"]')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" })
      } else {
        console.warn("FAQ section not found") // Added error handling
      }
      return
    }

    // For Services and About us, require authentication
    if (!isAuthenticated) {
      console.log("User not authenticated, showing login modal") // Added debugging
      setIsLoginModalOpen(true)
      return
    }

    console.log("Navigating to dashboard") // Added debugging
    router.push("/dashboard")
  }

  return (
    <>
      <nav className="w-full bg-[#4490CC] py-3">
        <div className="flex items-center gap-11 pl-[85px]">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item)}
              className="text-white text-xl font-medium leading-6 hover:text-blue-100 transition-colors duration-200"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {isLoginModalOpen && <LoginOverlay isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />}
    </>
  )
}
