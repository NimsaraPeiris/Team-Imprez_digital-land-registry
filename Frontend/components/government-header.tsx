"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/contexts/translation-context"

export default function GovernmentHeader() {
  const router = useRouter()
  const { currentLanguage, setLanguage, t } = useTranslation()

  const handleLogoClick = () => {
    router.push('/')
  }

  const handleLanguageChange = (lang: "en" | "si" | "ta") => {
    setLanguage(lang)
  }
  return (
    <div className="w-full bg-[#00508E] px-20 py-8 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left section with logo and department info */}
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity" onClick={handleLogoClick}>
          <div className="relative">
            <Image
              src="/generic-government-logo.png"
              alt="Department Logo"
              width={42}
              height={42}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-medium leading-7">{t('gov.department')}</h1>
            <p className="text-white text-base font-medium leading-5">{t('gov.digitalHub')}</p>
          </div>
        </div>

        {/* Right section with hotline and language options */}
        <div className="flex items-center gap-16">
          {/* Hotline */}
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold">{t('gov.hotline')}</span>
            <span className="text-white text-lg font-bold">1919</span>
          </div>

          {/* Language options */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleLanguageChange('si')}
              className={`text-white text-lg hover:underline transition-all ${
                currentLanguage === 'si' ? 'font-bold underline' : 'font-medium'
              }`}
            >
              සිංහල
            </button>
            <button 
              onClick={() => handleLanguageChange('ta')}
              className={`text-white text-lg hover:underline transition-all ${
                currentLanguage === 'ta' ? 'font-bold underline' : 'font-medium'
              }`}
            >
              தமிழ்
            </button>
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`text-white text-lg hover:underline transition-all ${
                currentLanguage === 'en' ? 'font-bold underline' : 'font-medium'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
