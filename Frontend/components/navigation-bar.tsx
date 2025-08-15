"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import LoginOverlay from "./login-overlay"
import { useSmoothScroll, getActiveSection } from "@/lib/use-smooth-scroll"

export default function NavigationBar() {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("Home")
  const { scrollToSection } = useSmoothScroll()
  const [currentPath, setCurrentPath] = useState('')

  // Track current path
  useEffect(() => {
    // Set initial path
    setCurrentPath(window.location.pathname)
    
    // Update path when component mounts or route changes
    const updatePath = () => {
      setCurrentPath(window.location.pathname)
    }
    
    // Listen for browser navigation events
    window.addEventListener('popstate', updatePath)
    
    // Also listen for pushstate and replacestate (for Next.js navigation)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function(data: any, unused: string, url?: string | URL | null) {
      originalPushState.call(history, data, unused, url)
      updatePath()
    }
    
    history.replaceState = function(data: any, unused: string, url?: string | URL | null) {
      originalReplaceState.call(history, data, unused, url)
      updatePath()
    }
    
    return () => {
      window.removeEventListener('popstate', updatePath)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push('/') // Redirect to home page
  }
  
  // All navigation items
  const allNavItems = [
    { label: "Home", section: "home" },
    { label: "Services", section: "services" },
    { label: "About us", section: "about" },
    { label: "News & Events", section: "announcements" },
    { label: "FAQ", section: "faq" },
    { label: "Contact s", section: "contact" }
  ]

  // Dashboard specific navigation items
  const dashboardNavItems = [
    { label: "Home", section: "home" },
    { label: "Services", section: "services" },
    // { label: "Contact Us", section: "contact" }
  ]

  // Choose navigation items based on current path
  const navItems = currentPath === '/dashboard' ? dashboardNavItems : allNavItems

  // Handle navigation clicks
  const handleNavigation = (item: { label: string; section: string }) => {
    console.log(`Navigation clicked: ${item.label}, Authenticated: ${isAuthenticated}`)
    const currentPath = window.location.pathname
    const isDashboard = currentPath === '/dashboard'

    // Handle Home navigation - different behavior for different pages
    if (item.section === "home") {
      if (isDashboard) {
        // On dashboard, scroll to welcome section
        scrollToSection(item.section)
      } else if (currentPath !== '/') {
        // On other pages, go to home page
        router.push('/')
      } else {
        // If we're on home page, scroll to top
        scrollToSection(item.section)
      }
      setActiveSection(item.label)
      return
    }

    // Handle Services navigation
    if (item.section === "services") {
      if (isAuthenticated) {
        // If authenticated, go to dashboard or scroll to services section
        const currentPath = window.location.pathname
        if (currentPath === '/dashboard') {
          // On dashboard, scroll to services
          scrollToSection(item.section)
        } else {
          // On other pages, go to dashboard
          router.push('/dashboard')
        }
      } else {
        // If not authenticated, try to scroll to services section or show login
        const servicesSection = document.querySelector('[data-section="services"]')
        if (servicesSection) {
          scrollToSection(item.section)
          // Show login modal after scrolling
          setTimeout(() => {
            console.log("User not authenticated, showing login modal for services")
            setIsLoginModalOpen(true)
          }, 500)
        } else {
          // No services section on this page, show login immediately
          setIsLoginModalOpen(true)
        }
      }
      setActiveSection(item.label)
      return
    }

    // Handle sections that may not exist on dashboard
    const publicSections = ["contact", "announcements", "faq", "about"]
    if (publicSections.includes(item.section)) {
      // Check if we're on dashboard and this section doesn't exist
      if (isDashboard) {
        const targetSection = document.querySelector(`[data-section="${item.section}"]`)
        if (targetSection) {
          // Section exists on dashboard, scroll to it
          scrollToSection(item.section)
          setActiveSection(item.label)
        } else {
          // Section doesn't exist on dashboard, navigate to home page for these sections
          if (item.section === "contact") {
            // Contact exists on dashboard, scroll to it
            scrollToSection(item.section)
            setActiveSection(item.label)
          } else {
            // For About us, News & Events, FAQ - go to home page
            console.log(`${item.label} not available on dashboard, navigating to home page`)
            router.push('/' + `#${item.section}`)
          }
        }
      } else {
        // Not on dashboard - normal behavior
        const targetSection = document.querySelector(`[data-section="${item.section}"]`)
        if (targetSection) {
          // Section exists on current page, scroll to it
          scrollToSection(item.section)
        } else {
          // Section doesn't exist on current page, go to home page
          router.push('/' + (item.section !== 'home' ? `#${item.section}` : ''))
        }
        setActiveSection(item.label)
      }
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
  }, [navItems])

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

          {/* User actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <>
                <span className="text-blue-100 text-sm font-medium">
                  Welcome, {user.name || user.id}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {isLoginModalOpen && <LoginOverlay isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />}
    </>
  )
}
