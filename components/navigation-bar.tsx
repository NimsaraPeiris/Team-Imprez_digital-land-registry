"use client"

import { useRouter } from "next/navigation"

export default function NavigationBar() {
  const router = useRouter()
  const navItems = ["Home", "Services", "About us", "Contact Us", "News & Events", "FAQ"]

  const handleNavigation = (item: string) => {
    if (item === "Contact Us") {
      // Scroll to contact section
      const contactSection = document.querySelector('[data-section="contact"]')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // Navigate to home page for other items
      router.push("/")
    }
  }

  return (
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
  )
}
