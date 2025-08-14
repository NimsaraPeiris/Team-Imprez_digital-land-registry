import { useCallback } from 'react'

interface ScrollOptions {
  headerOffset?: number
  behavior?: ScrollBehavior
  onScrollComplete?: () => void
}

export function useSmoothScroll() {
  const scrollToSection = useCallback((
    sectionId: string, 
    options: ScrollOptions = {}
  ) => {
    const {
      headerOffset = 140, // Default header height (government header + nav)
      behavior = 'smooth',
      onScrollComplete
    } = options

    // Handle home/top scroll
    if (sectionId === 'home' || sectionId === 'top') {
      window.scrollTo({ top: 0, behavior })
      onScrollComplete?.()
      return
    }

    // Find the target section
    const targetSection = document.querySelector(`[data-section="${sectionId}"]`)
    
    if (!targetSection) {
      console.warn(`Section with data-section="${sectionId}" not found`)
      return
    }

    // Calculate the target position with header offset
    const elementPosition = targetSection.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    // Perform the scroll
    window.scrollTo({
      top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative values
      behavior
    })

    // Call completion callback if provided
    if (onScrollComplete) {
      // Use setTimeout to ensure scroll has started
      setTimeout(onScrollComplete, 100)
    }
  }, [])

  const scrollToElement = useCallback((
    element: Element,
    options: ScrollOptions = {}
  ) => {
    const {
      headerOffset = 140,
      behavior = 'smooth',
      onScrollComplete
    } = options

    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior
    })

    if (onScrollComplete) {
      setTimeout(onScrollComplete, 100)
    }
  }, [])

  return {
    scrollToSection,
    scrollToElement
  }
}

// Helper function to check if an element is in the viewport with offset
export function isElementInViewport(
  element: Element, 
  headerOffset: number = 140,
  buffer: number = 50
): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight

  return (
    rect.top >= -buffer &&
    rect.top <= headerOffset + buffer &&
    rect.bottom >= headerOffset &&
    rect.bottom <= windowHeight + buffer
  )
}

// Helper function to get the currently active section
export function getActiveSection(
  sections: { section: string; element?: Element | null }[],
  headerOffset: number = 140,
  buffer: number = 50
): string | null {
  // Check if we're at the top of the page
  if (window.scrollY < 100) {
    return 'home'
  }

  // Find the section that's currently most visible
  const currentScroll = window.scrollY + headerOffset + buffer
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element) {
      const sectionTop = section.element.getBoundingClientRect().top + window.pageYOffset
      if (currentScroll >= sectionTop) {
        return section.section
      }
    }
  }

  return null
}
