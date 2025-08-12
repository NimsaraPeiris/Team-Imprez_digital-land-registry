"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import GovernmentHeader from "@/components/government-header"
import NavigationBar from "@/components/navigation-bar"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { ChevronDown, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    id: "",
    requesterType: "",
    registrationOffice: "",
  })

  const [idError, setIdError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")

  const [showOtpSection, setShowOtpSection] = useState(false)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState("")

  const validatePhoneNumber = (phone: string): string => {
    if (!phone) return ""

    const cleanPhone = phone.replace(/[\s\-$$$$]/g, "")

    let processedPhone = cleanPhone
    if (cleanPhone.startsWith("+94")) {
      processedPhone = "0" + cleanPhone.substring(3)
    } else if (cleanPhone.startsWith("94") && cleanPhone.length === 11) {
      processedPhone = "0" + cleanPhone.substring(2)
    }

    if (!processedPhone.startsWith("0") || processedPhone.length !== 10) {
      return "Phone number must be 10 digits starting with 0 or include +94 country code"
    }

    const prefix = processedPhone.substring(1, 3)

    const validPrefixes = [
      "70",
      "71",
      "72",
      "74",
      "75",
      "76",
      "77",
      "78",
      "11",
      "21",
      "23",
      "24",
      "25",
      "26",
      "27",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "41",
      "45",
      "47",
      "51",
      "52",
      "54",
      "55",
      "57",
      "63",
      "65",
      "66",
      "67",
      "81",
      "91",
    ]

    if (!validPrefixes.includes(prefix)) {
      return "Invalid Sri Lankan phone number prefix"
    }

    return ""
  }

  const validateNIC = (nic: string): string => {
    if (!nic) return ""

    const cleanNIC = nic.trim().toUpperCase()

    if (/^\d{12}$/.test(cleanNIC)) {
      return validateNewNIC(cleanNIC)
    }

    if (/^\d{9}[VX]$/.test(cleanNIC)) {
      return validateOldNIC(cleanNIC)
    }

    return "Invalid NIC format. Use either 12 digits (new format) or 9 digits followed by V/X (old format)"
  }

  const validateNewNIC = (nic: string): string => {
    const year = Number.parseInt(nic.substring(0, 4))
    const dayOfYear = Number.parseInt(nic.substring(4, 7))

    if (year < 1900 || year > new Date().getFullYear()) {
      return "Invalid birth year"
    }

    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    const maxDays = isLeapYear ? 366 : 365

    if (dayOfYear >= 1 && dayOfYear <= maxDays) {
      return ""
    } else if (dayOfYear >= 501 && dayOfYear <= 500 + maxDays) {
      return ""
    } else {
      return "Invalid day of year for the given birth year"
    }
  }

  const validateOldNIC = (nic: string): string => {
    const yearDigits = Number.parseInt(nic.substring(0, 2))
    const dayOfYear = Number.parseInt(nic.substring(2, 5))
    const voterStatus = nic.charAt(9)

    const currentYear = new Date().getFullYear()
    const currentCentury = Math.floor(currentYear / 100) * 100
    const fullYear = yearDigits <= currentYear % 100 ? currentCentury + yearDigits : currentCentury - 100 + yearDigits

    const isLeapYear = (fullYear % 4 === 0 && fullYear % 100 !== 0) || fullYear % 400 === 0
    const maxDays = isLeapYear ? 366 : 365

    if (voterStatus !== "V" && voterStatus !== "X") {
      return "Invalid voter status. Must end with V or X"
    }

    if (dayOfYear >= 1 && dayOfYear <= maxDays) {
      return ""
    } else if (dayOfYear >= 501 && dayOfYear <= 500 + maxDays) {
      return ""
    } else {
      return "Invalid day of year for the given birth year"
    }
  }

  const validateEmail = (email: string): string => {
    if (!email) return ""

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }

    if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
      return "Email address contains invalid characters"
    }

    if (email.length > 254) {
      return "Email address is too long"
    }

    return ""
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "id") {
      const error = validateNIC(value)
      setIdError(error)
    }

    if (field === "phone") {
      const error = validatePhoneNumber(value)
      setPhoneError(error)
    }

    if (field === "email") {
      const error = validateEmail(value)
      setEmailError(error)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleContinue = async () => {
    const hasErrors = idError || phoneError || emailError
    const hasEmptyFields =
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.id ||
      !formData.requesterType ||
      !formData.registrationOffice

    if (hasErrors || hasEmptyFields) {
      alert("Please fill all fields correctly before continuing")
      return
    }

    setIsLoading(true)
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false)
      setShowOtpSection(true)
    }, 2000)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      login({
        id: formData.id,
        phone: formData.phone,
        name: formData.fullName,
        email: formData.email,
        requesterType: formData.requesterType,
        registrationOffice: formData.registrationOffice,
      })
      router.push("/dashboard")
    }, 2000)
  }

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setOtp(numericValue)
    if (otpError) setOtpError("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <NavigationBar />
      </div>

      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            {!showOtpSection ? (
              <>
                <div className="mb-8">
                  <h1 className="text-xl font-extrabold text-black leading-6">
                    Enter Your details: <span className="font-normal">For Registration</span>
                  </h1>
                </div>

                <form className="space-y-6">
                  {/* ... existing form fields ... */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                        placeholder="Enter seller's full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">E-mail</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                            emailError ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                          }`}
                          placeholder="example@email.com"
                        />
                        {emailError && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {emailError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">Phone</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                            phoneError ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                          }`}
                          placeholder="+94 70 123 4567 or 0701234567"
                        />
                        {phoneError && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {phoneError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">Id</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.id}
                          onChange={(e) => handleInputChange("id", e.target.value)}
                          className={`w-full h-10 px-3 bg-[#E9E9E9] rounded-md text-sm text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                            idError ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                          }`}
                          placeholder="123456789V or 200012345678"
                        />
                        {idError && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {idError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {idError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">Requester Type</label>
                      <div className="relative">
                        <select
                          value={formData.requesterType}
                          onChange={(e) => handleInputChange("requesterType", e.target.value)}
                          className="w-full h-10 px-5 bg-white rounded-lg border border-[#B2ACAC] text-sm text-[#413F3F] appearance-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                        >
                          <option value="">Requester Type</option>
                          <option value="individual">Individual</option>
                          <option value="organization">Organization</option>
                          <option value="government">Government Entity</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#413F3F] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">Nearest Registration Office</label>
                      <div className="relative">
                        <select
                          value={formData.registrationOffice}
                          onChange={(e) => handleInputChange("registrationOffice", e.target.value)}
                          className="w-full h-10 px-5 bg-white rounded-lg border border-[#B2ACAC] text-sm text-[#413F3F] appearance-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                        >
                          <option value="">Nearest Registration Office</option>
                          <option value="colombo">Colombo Registration Office</option>
                          <option value="kandy">Kandy Registration Office</option>
                          <option value="galle">Galle Registration Office</option>
                          <option value="jaffna">Jaffna Registration Office</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#413F3F] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-3 bg-white border border-[#00508E] rounded-lg text-black text-base font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="px-5 py-3 bg-[#002E51] text-white rounded-lg text-base font-medium hover:bg-[#001a2e] transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? "Sending OTP..." : "Continue"}
                      <div className="w-6 h-6 rounded-full flex items-center justify-center">
                        <img src="/right-arrow-icon.png" alt="Continue arrow" className="w-3 h-3" />
                      </div>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-xl font-extrabold text-black leading-6 text-center">Verify Your Phone Number</h1>
                  <p className="text-gray-600 mt-2 text-center">
                    We've sent a 6-digit verification code to {formData.phone}
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-black text-sm font-semibold">Enter OTP Code</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => handleOtpChange(e.target.value)}
                          className={`w-full h-12 px-4 bg-[#E9E9E9] rounded-md text-lg text-center tracking-widest placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                            otpError ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        {otpError && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {otpError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {otpError}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowOtpSection(false)}
                        className="flex-1 px-5 py-3 bg-white border border-[#00508E] rounded-lg text-black text-base font-medium hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isLoading}
                        className="flex-1 px-5 py-3 bg-[#002E51] text-white rounded-lg text-base font-medium hover:bg-[#001a2e] transition-colors disabled:opacity-50"
                      >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>

                    <div className="text-center pt-4">
                      <button type="button" className="text-[#00508E] text-sm hover:underline" onClick={handleContinue}>
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  )
}
