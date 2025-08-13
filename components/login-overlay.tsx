"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { X, User, Phone, Shield, AlertCircle } from "lucide-react"

interface LoginOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginOverlay({ isOpen, onClose }: LoginOverlayProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [otpSent, setOtpSent] = useState(false)
  const [idNumber, setIdNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [idError, setIdError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  if (!isOpen) return null

  const validateNIC = (nic: string): string => {
    // Format check: must be exactly 12 digits
    if (!/^\d{12}$/.test(nic)) {
      return "NIC must be exactly 12 digits"
    }

    // Year validation (first 4 digits)
    const year = Number.parseInt(nic.substring(0, 4))
    const currentYear = new Date().getFullYear()
    if (year < 1900 || year > currentYear) {
      return "Invalid year of birth"
    }

    // Day of year validation (digits 5-7)
    const dayOfYear = Number.parseInt(nic.substring(4, 7))

    // Check if it's a valid day range
    if (dayOfYear < 1 || (dayOfYear > 366 && dayOfYear < 501) || dayOfYear > 866) {
      return "Invalid day of year"
    }

    // For females (500+ range), check if it's valid after subtracting 500
    if (dayOfYear > 500) {
      const actualDay = dayOfYear - 500
      if (actualDay < 1 || actualDay > 366) {
        return "Invalid day of year for female"
      }
    }

    // Check if day is valid for the specific year (leap year consideration)
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    const maxDays = isLeapYear ? 366 : 365
    const actualDayOfYear = dayOfYear > 500 ? dayOfYear - 500 : dayOfYear

    if (actualDayOfYear > maxDays) {
      return `Invalid day ${actualDayOfYear} for year ${year}`
    }

    return ""
  }

  const validatePhoneNumber = (phone: string): string => {
    // Remove special characters
    let cleanPhone = phone.replace(/[\s\-$$$$]/g, "")

    // Handle international country code +94
    if (cleanPhone.startsWith("+94")) {
      cleanPhone = cleanPhone.substring(3)
    } else if (cleanPhone.startsWith("94")) {
      cleanPhone = cleanPhone.substring(2)
    }

    // Check if starts with 0 and is 10 digits, or is 9 digits without 0
    if (cleanPhone.startsWith("0")) {
      if (cleanPhone.length !== 10) {
        return "Phone number must be 10 digits when starting with 0"
      }
      cleanPhone = cleanPhone.substring(1) // Remove leading 0 for prefix check
    } else if (cleanPhone.length !== 9) {
      return "Phone number must be 9 digits without leading 0"
    }

    // Valid Sri Lankan mobile and landline prefixes
    const validPrefixes = [
      // Mobile prefixes
      "70",
      "71",
      "72",
      "74",
      "75",
      "76",
      "77",
      "78",
      // Landline prefixes
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

    const prefix = cleanPhone.substring(0, 2)
    if (!validPrefixes.includes(prefix)) {
      return "Invalid phone number prefix"
    }

    return ""
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    const nicError = validateNIC(idNumber)
    if (nicError) {
      setIdError(nicError)
      return
    }

    const phoneValidationError = validatePhoneNumber(phoneNumber)
    if (phoneValidationError) {
      setPhoneError(phoneValidationError)
      return
    }

    if (!idNumber || !phoneNumber) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setOtpSent(true)
    setIsLoading(false)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    login({ id: idNumber, phone: phoneNumber })
    handleClose()
    router.push("/dashboard")
  }

  const handleClose = () => {
    setOtpSent(false)
    setIdNumber("")
    setPhoneNumber("")
    setOtpCode("")
    setIsLoading(false)
    setIdError("")
    setPhoneError("")
    onClose()
  }

  const handleNewUser = () => {
    onClose() // Close the overlay first
    router.push("/register") // Navigate to registration page
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          {otpSent ? "Enter OTP Code" : "Login to Your Account"}
        </h2>

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                    setIdNumber(value)
                    if (idError) setIdError("")
                  }}
                  placeholder="Enter your 12-digit NIC number"
                  className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-[#00508E] focus:border-transparent ${
                    idError ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={12}
                  required
                />
              </div>
              {idError && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{idError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    if (phoneError) setPhoneError("")
                  }}
                  placeholder="Enter your phone number (+94xxxxxxxxx or 0xxxxxxxxx)"
                  className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-[#00508E] focus:border-transparent ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {phoneError && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{phoneError}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#00508E] text-white py-3 rounded-md font-medium hover:bg-[#004070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
              <button
                type="button"
                onClick={handleNewUser}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                New User
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                We've sent a 6-digit code to <br />
                <span className="font-medium">{phoneNumber}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP Code</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00508E] focus:border-transparent text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="flex-1 bg-[#00508E] text-white py-3 rounded-md font-medium hover:bg-[#004070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            </div>

            <div className="text-center pt-2">
              <button type="button" onClick={handleSendOTP} className="text-sm text-[#00508E] hover:underline">
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
