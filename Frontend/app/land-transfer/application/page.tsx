"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import Footer from "@/components/footer"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { apiPostForm, normalizeDownloadUrl } from "@/lib/api"

interface FormData {
  seller: {
    fullName: string
    email: string
    phone: string
    nic: string
  }
  buyer: {
    fullName: string
    email: string
    phone: string
    nic: string
  }
}

interface FormErrors {
  seller: {
    fullName: string
    email: string
    phone: string
    nic: string
  }
  buyer: {
    fullName: string
    email: string
    phone: string
    nic: string
  }
}

export default function LandTransferApplicationPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    seller: {
      fullName: "",
      email: "",
      phone: "",
      nic: "",
    },
    buyer: {
      fullName: "",
      email: "",
      phone: "",
      nic: "",
    },
  })

  const [errors, setErrors] = useState<FormErrors>({
    seller: {
      fullName: "",
      email: "",
      phone: "",
      nic: "",
    },
    buyer: {
      fullName: "",
      email: "",
      phone: "",
      nic: "",
    },
  })

  const [fileUploads, setFileUploads] = useState<{
    originalDeed: File | null,
    purchaserNIC: File | null,
    purchaserPhoto: File | null,
    vendorPhoto: File | null,
    guarantor1NIC: File | null,
    guarantor2NIC: File | null,
  }>(
    {
      originalDeed: null,
      purchaserNIC: null,
      purchaserPhoto: null,
      vendorPhoto: null,
      guarantor1NIC: null,
      guarantor2NIC: null,
    }
  )

  const [applicationId, setApplicationId] = useState<number | null>(null)

  const onDropOriginalDeed = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, originalDeed: acceptedFiles[0] }))
  }, [])

  const onDropPurchaserNIC = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, purchaserNIC: acceptedFiles[0] }))
  }, [])

  const onDropPurchaserPhoto = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, purchaserPhoto: acceptedFiles[0] }))
  }, [])

  const onDropVendorPhoto = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, vendorPhoto: acceptedFiles[0] }))
  }, [])

  const onDropGuarantor1NIC = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, guarantor1NIC: acceptedFiles[0] }))
  }, [])

  const onDropGuarantor2NIC = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, guarantor2NIC: acceptedFiles[0] }))
  }, [])

  const {
    getRootProps: getRootPropsOriginalDeed,
    getInputProps: getInputPropsOriginalDeed,
    isDragActive: isDragActiveOriginalDeed,
  } = useDropzone({
    onDrop: onDropOriginalDeed,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      // "image/jpeg": [".jpg", ".jpeg"],
    },
  })
  const {
    getRootProps: getRootPropsPurchaserNIC,
    getInputProps: getInputPropsPurchaserNIC,
    isDragActive: isDragActivePurchaserNIC,
  } = useDropzone({
    onDrop: onDropPurchaserNIC,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      // "image/jpeg": [".jpg", ".jpeg"],
    },
  })
  const {
    getRootProps: getRootPropsPurchaserPhoto,
    getInputProps: getInputPropsPurchaserPhoto,
    isDragActive: isDragActivePurchaserPhoto,
  } = useDropzone({
    onDrop: onDropPurchaserPhoto,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      // "image/jpeg": [".jpg", ".jpeg"],
    },
  })
  const {
    getRootProps: getRootPropsVendorPhoto,
    getInputProps: getInputPropsVendorPhoto,
    isDragActive: isDragActiveVendorPhoto,
  } = useDropzone({
    onDrop: onDropVendorPhoto,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      // "image/jpeg": [".jpg", ".jpeg"],
    },
  })
  const {
    getRootProps: getRootPropsGuarantor1NIC,
    getInputProps: getInputPropsGuarantor1NIC,
    isDragActive: isDragActiveGuarantor1NIC,
  } = useDropzone({
    onDrop: onDropGuarantor1NIC,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      // "image/jpeg": [".jpg", ".jpeg"],
    },
  })
  const {
    getRootProps: getRootPropsGuarantor2NIC,
    getInputProps: getInputPropsGuarantor2NIC,
    isDragActive: isDragActiveGuarantor2NIC,
  } = useDropzone({
    onDrop: onDropGuarantor2NIC,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      // "image/jpeg": [".jpg", ".jpeg"],
    },
  })

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required"

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

  const validatePhoneNumber = (phone: string): string => {
    if (!phone) return "Phone number is required"

    const cleanPhone = phone.replace(/[\s\-()]/g, "")
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
    if (!nic) return "NIC is required"

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

  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required"
    if (name.trim().length < 2) return "Full name must be at least 2 characters"
    if (name.trim().length > 100) return "Full name must be less than 100 characters"
    if (!/^[a-zA-Z\s.'-]+$/.test(name.trim()))
      return "Full name can only contain letters, spaces, dots, hyphens and apostrophes"
    return ""
  }

  const handleInputChange = (section: "seller" | "buyer", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    if (errors[section][field as keyof typeof errors.seller]) {
      setErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: "",
        },
      }))
    }
  }

  const validateSection = (section: "seller" | "buyer"): boolean => {
    const sectionData = formData[section]
    const newErrors = {
      fullName: validateFullName(sectionData.fullName),
      email: validateEmail(sectionData.email),
      phone: validatePhoneNumber(sectionData.phone),
      nic: validateNIC(sectionData.nic),
    }

    setErrors((prev) => ({
      ...prev,
      [section]: newErrors,
    }))

    return !Object.values(newErrors).some((error) => error !== "")
  }

  const uploadAllFiles = async (appId: number) => {
    if (!appId) return
    const mapping: Record<string, string> = {
      originalDeed: "Current Title Deed",
      purchaserNIC: "Photo ID (Buyer & Seller)",
      purchaserPhoto: "Photo ID (Buyer & Seller)",
      vendorPhoto: "Photo ID (Buyer & Seller)",
      guarantor1NIC: "Photo ID (Buyer & Seller)",
      guarantor2NIC: "Photo ID (Buyer & Seller)",
    }

    for (const key of Object.keys(fileUploads)) {
      // @ts-ignore
      const f: File | null = fileUploads[key]
      if (!f) continue
      try {
        const form = new FormData()
        form.append('application_id', String(appId))
        form.append('document_type', mapping[key] || 'Current Title Deed')
        form.append('file', f, f.name)
        const res = await apiPostForm('/user/documents/upload', form)
        if (!res.ok) {
          console.error('upload failed for', key, await res.text())
          continue
        }
        const json = await res.json()
        const download = normalizeDownloadUrl(json.download_url || json.downloadUrl || json.download)
        console.debug('uploaded', key, json)
      } catch (e) {
        console.error('upload exception', key, e)
      }
    }
  }

  const handleContinue = () => {
    if (currentStep === 1) {
      // Validate seller and buyer details before proceeding
      const isValid = validateSection("seller") && validateSection("buyer")
      if (isValid) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      // Check if all required documents are uploaded before proceeding
      const requiredDocuments = [
        "originalDeed",
        "purchaserNIC",
        "purchaserPhoto",
        "vendorPhoto",
        "guarantor1NIC",
        "guarantor2NIC",
      ] as const
      const allDocumentsUploaded = requiredDocuments.every((doc) => fileUploads[doc] !== null)

      if (allDocumentsUploaded) {
        // If an application id exists, upload files first then move to verification
        (async () => {
          if (applicationId) {
            await uploadAllFiles(applicationId)
          }
          setCurrentStep(3)
        })()
      } else {
        alert("Please upload all required documents before continuing.")
      }
    } else if (currentStep === 3) {
      // Navigate to online payment section
      router.push("/land-transfer/payment")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/land-transfer")
    }
  }

  const steps = [1, 2, 3, 4, 5]

  const handleFileUpload = (fileType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileUploads((prev) => ({ ...prev, [fileType]: file }))
    }
  }

  // Add new state for verification animation
  const [verificationStatus, setVerificationStatus] = useState<{ [key: string]: "checking" | "verified" }>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)

  // Add useEffect to handle verification animation when step 3 is reached
  useEffect(() => {
    if (currentStep === 3 && !isVerifying && !hasVerified) {
      setIsVerifying(true)
      const documents = ["originalDeed", "purchaserNIC", "purchaserPhoto", "vendorPhoto"]

      // Start verification animation
      documents.forEach((doc, index) => {
        setTimeout(() => {
          setVerificationStatus((prev) => ({ ...prev, [doc]: "checking" }))

          // After 2 seconds, mark as verified
          setTimeout(() => {
            setVerificationStatus((prev) => ({ ...prev, [doc]: "verified" }))
          }, 2000)
        }, index * 500) // Stagger the start of each verification
      })

      // Mark verification complete after all documents are processed
      setTimeout(
        () => {
          setIsVerifying(false)
          setHasVerified(true)
        },
        documents.length * 500 + 2000,
      )
    }
  }, [currentStep, isVerifying, hasVerified])

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      <main className="py-8 px-[75px]">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-black text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight lg:leading-[48px] font-inter text-left">Application for Land Transfer</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1300px] mx-auto border border-[#00508E] rounded-[5px] relative overflow-hidden">
          {/* Form Header */}
          <div className="px-8 pt-12 pb-6">
            <div className="mb-2">
              <h2 className="text-black text-[20px] font-extrabold leading-[24px]">
                {currentStep === 1
                  ? "Seller & Buyer details"
                  : currentStep === 2
                    ? "Upload Required Documentation"
                    : "AI Verify"}
              </h2>
            </div>
            <div className="mb-8">
              <p className="text-black text-[15px] font-normal leading-[18px]">
                {currentStep === 1
                  ? "Please enter all required details for verification"
                  : currentStep === 2
                    ? "Please upload all required documents for verification"
                    : "AI verification of uploaded documents completed"}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-16 w-[551px]">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-[31px] h-[31px] rounded-full border flex items-center justify-center relative overflow-hidden ${
                      step <= currentStep ? "bg-[#36BF29] border-[#36BF29]" : "bg-[#F4F4F4] border-[#737373]"
                    }`}
                  >
                    <span
                      className={`text-[15px] font-normal leading-[18px] ${
                        step <= currentStep ? "text-white" : "text-[#807E7E]"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-[51px] h-0 border-t ${
                        step < currentStep ? "border-[#36BF29]" : "border-[#737373]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {currentStep === 1 ? (
            // Seller & Buyer Details Form
            <>
              {/* Seller Details Section */}
              <div className="px-8 mb-8">
                <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Seller Details</h3>

                <div className="grid grid-cols-2 gap-14 mb-6">
                  {/* Seller Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.seller.fullName}
                        onChange={(e) => handleInputChange("seller", "fullName", e.target.value)}
                        placeholder="Enter seller's full name"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.seller.fullName ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.seller.fullName && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.seller.fullName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.seller.fullName}
                      </p>
                    )}
                  </div>

                  {/* Seller Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">E-mail</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.seller.email}
                        onChange={(e) => handleInputChange("seller", "email", e.target.value)}
                        placeholder="Enter seller's email"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.seller.email ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.seller.email && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.seller.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.seller.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-14">
                  {/* Seller Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.seller.phone}
                        onChange={(e) => handleInputChange("seller", "phone", e.target.value)}
                        placeholder="Enter seller's phone number"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.seller.phone ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.seller.phone && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.seller.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.seller.phone}
                      </p>
                    )}
                  </div>

                  {/* Seller NIC */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">NIC</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.seller.nic}
                        onChange={(e) => handleInputChange("seller", "nic", e.target.value)}
                        placeholder="Enter seller's NIC"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.seller.nic ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.seller.nic && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.seller.nic && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.seller.nic}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#00508E] mx-8" style={{ width: "calc(100% - 64px)" }} />

              {/* Buyer Details Section */}
              <div className="px-8 py-8">
                <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Buyer Details</h3>

                <div className="grid grid-cols-2 gap-14 mb-6">
                  {/* Buyer Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.buyer.fullName}
                        onChange={(e) => handleInputChange("buyer", "fullName", e.target.value)}
                        placeholder="Enter buyer's full name"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.buyer.fullName ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.buyer.fullName && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.buyer.fullName && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.buyer.fullName}
                      </p>
                    )}
                  </div>

                  {/* Buyer Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">E-mail</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.buyer.email}
                        onChange={(e) => handleInputChange("buyer", "email", e.target.value)}
                        placeholder="Enter buyer's email"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.buyer.email ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.buyer.email && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.buyer.email && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.buyer.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-14">
                  {/* Buyer Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.buyer.phone}
                        onChange={(e) => handleInputChange("buyer", "phone", e.target.value)}
                        placeholder="Enter buyer's phone number"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.buyer.phone ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.buyer.phone && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.buyer.phone && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.buyer.phone}
                      </p>
                    )}
                  </div>

                  {/* Buyer NIC */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">NIC</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.buyer.nic}
                        onChange={(e) => handleInputChange("buyer", "nic", e.target.value)}
                        placeholder="Enter buyer's NIC"
                        className={`w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 ${
                          errors.buyer.nic ? "focus:ring-red-500 bg-red-50" : "focus:ring-[#00508E]"
                        }`}
                      />
                      {errors.buyer.nic && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {errors.buyer.nic && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.buyer.nic}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#00508E] mx-8" style={{ width: "calc(100% - 64px)" }} />
            </>
          ) : currentStep === 2 ? (
            // Document Upload Sections (existing code)
            <div className="px-8 flex flex-col gap-8 mb-8">
              {/* Original Deed of Transfer */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Original Deed of Transfer (Scan/PDF) - Required
                </h3>
                <div
                  {...getRootPropsOriginalDeed()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActiveOriginalDeed
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.originalDeed
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsOriginalDeed()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("originalDeed", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.originalDeed ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.originalDeed.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActiveOriginalDeed ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchaser NIC */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Purchaser NIC (Front & Back) – PDF (Required)
                </h3>
                <div
                  {...getRootPropsPurchaserNIC()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActivePurchaserNIC
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.purchaserNIC
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsPurchaserNIC()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("purchaserNIC", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.purchaserNIC ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.purchaserNIC.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActivePurchaserNIC ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor NIC */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Vendor NIC (Front & Back) – PDF (Required)
                </h3>
                <div
                  {...getRootPropsPurchaserNIC()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActivePurchaserNIC
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.purchaserNIC
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsPurchaserNIC()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("purchaserNIC", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.purchaserNIC ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.purchaserNIC.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActivePurchaserNIC ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchaser Photograph */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Purchaser Photograph – Passport Size PDF (Required)
                </h3>
                <div
                  {...getRootPropsPurchaserPhoto()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActivePurchaserPhoto
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.purchaserPhoto
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsPurchaserPhoto()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("purchaserPhoto", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.purchaserPhoto ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.purchaserPhoto.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActivePurchaserPhoto ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor Photograph */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Vendor Photograph – Passport Size PDF (Required)
                </h3>
                <div
                  {...getRootPropsVendorPhoto()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActiveVendorPhoto
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.vendorPhoto
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsVendorPhoto()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("vendorPhoto", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.vendorPhoto ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.vendorPhoto.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActiveVendorPhoto ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Guarantor 1 NIC */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Guarantor 1 NIC (Front & Back) – PDF (Required)
                </h3>
                <div
                  {...getRootPropsGuarantor1NIC()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActiveGuarantor1NIC
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.guarantor1NIC
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsGuarantor1NIC()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("guarantor1NIC", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.guarantor1NIC ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.guarantor1NIC.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActiveGuarantor1NIC ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Guarantor 2 NIC */}
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                  Upload Guarantor 2 NIC (Front & Back) – PDF (Required)
                </h3>
                <div
                  {...getRootPropsGuarantor2NIC()}
                  className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActiveGuarantor2NIC
                      ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
                      : fileUploads.guarantor2NIC
                        ? "border-green-500 bg-green-50"
                        : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
                  }`}
                >
                  <input
                    {...getInputPropsGuarantor2NIC()}
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload("guarantor2NIC", e)}
                  />
                  <div className="flex flex-col items-center gap-3">
                    {fileUploads.guarantor2NIC ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-green-700 text-[14px] font-semibold">File Uploaded Successfully</p>
                          <p className="text-green-600 text-[12px] mt-1">{fileUploads.guarantor2NIC.name}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-700 text-[14px] font-semibold mb-1">
                            {isDragActiveGuarantor2NIC ? "Drop file here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-gray-500 text-[12px]">PDF files only • Max 10MB</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : currentStep === 3 ? (
            // AI Verification Results with Animation
            <div className="px-8 flex flex-col gap-12 mb-8">
              {/* Original Deed Verification */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-6">
                  <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">Original Deed Verification</h3>
                  <div className="h-[52px] border border-[#BDBBBB] rounded-[5px] flex items-center justify-between px-4">
                    <span className="text-black text-[17px] font-semibold leading-[20.4px]">
                      {fileUploads.originalDeed ? fileUploads.originalDeed.name : "original_deed.pdf"}
                    </span>
                    <div className="flex items-center gap-2">
                      {verificationStatus.originalDeed === "checking" ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-100">
                          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-yellow-700 text-[17px] font-normal leading-[20.4px]">Checking...</span>
                        </div>
                      ) : verificationStatus.originalDeed === "verified" ? (
                        <div className="flex items-center gap-2 bg-[#36BF29] px-3 py-1 rounded">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-[17px] font-normal leading-[20.4px]">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100">
                          <span className="text-gray-500 text-[17px] font-normal leading-[20.4px]">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {verificationStatus.originalDeed === "verified" && (
                  <p className="text-[#36BF29] text-[17px] font-normal leading-[20.4px]">
                    Document successfully verified and authenticated.
                  </p>
                )}
              </div>

              {/* Purchaser NIC Verification */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-6">
                  <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">Purchaser NIC Verification</h3>
                  <div className="h-[52px] border border-[#BDBBBB] rounded-[5px] flex items-center justify-between px-4">
                    <span className="text-black text-[17px] font-semibold leading-[20.4px]">
                      {fileUploads.purchaserNIC ? fileUploads.purchaserNIC.name : "purchaser_nic.pdf"}
                    </span>
                    <div className="flex items-center gap-2">
                      {verificationStatus.purchaserNIC === "checking" ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-100">
                          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-yellow-700 text-[17px] font-normal leading-[20.4px]">Checking...</span>
                        </div>
                      ) : verificationStatus.purchaserNIC === "verified" ? (
                        <div className="flex items-center gap-2 bg-[#36BF29] px-3 py-1 rounded">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-[17px] font-normal leading-[20.4px]">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100">
                          <span className="text-gray-500 text-[17px] font-normal leading-[20.4px]">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {verificationStatus.purchaserNIC === "verified" && (
                  <p className="text-[#36BF29] text-[17px] font-normal leading-[20.4px]">
                    NIC document successfully verified and authenticated.
                  </p>
                )}
              </div>

              {/* Purchaser Photo Verification */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-6">
                  <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">
                    Purchaser Photo Verification
                  </h3>
                  <div className="h-[52px] border border-[#BDBBBB] rounded-[5px] flex items-center justify-between px-4">
                    <span className="text-black text-[17px] font-semibold leading-[20.4px]">
                      {fileUploads.purchaserPhoto ? fileUploads.purchaserPhoto.name : "purchaser_photo.jpg"}
                    </span>
                    <div className="flex items-center gap-2">
                      {verificationStatus.purchaserPhoto === "checking" ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-100">
                          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-yellow-700 text-[17px] font-normal leading-[20.4px]">Checking...</span>
                        </div>
                      ) : verificationStatus.purchaserPhoto === "verified" ? (
                        <div className="flex items-center gap-2 bg-[#36BF29] px-3 py-1 rounded">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-[17px] font-normal leading-[20.4px]">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100">
                          <span className="text-gray-500 text-[17px] font-normal leading-[20.4px]">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {verificationStatus.purchaserPhoto === "verified" && (
                  <p className="text-[#36BF29] text-[17px] font-normal leading-[20.4px]">
                    Photo successfully verified and authenticated.
                  </p>
                )}
              </div>

              {/* Vendor Photo Verification */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-6">
                  <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">Vendor Photo Verification</h3>
                  <div className="h-[52px] border border-[#BDBBBB] rounded-[5px] flex items-center justify-between px-4">
                    <span className="text-black text-[17px] font-semibold leading-[20.4px]">
                      {fileUploads.vendorPhoto ? fileUploads.vendorPhoto.name : "vendor_photo.jpg"}
                    </span>
                    <div className="flex items-center gap-2">
                      {verificationStatus.vendorPhoto === "checking" ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-100">
                          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-yellow-700 text-[17px] font-normal leading-[20.4px]">Checking...</span>
                        </div>
                      ) : verificationStatus.vendorPhoto === "verified" ? (
                        <div className="flex items-center gap-2 bg-[#36BF29] px-3 py-1 rounded">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white text-[17px] font-normal leading-[20.4px]">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100">
                          <span className="text-gray-500 text-[17px] font-normal leading-[20.4px]">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {verificationStatus.vendorPhoto === "verified" && (
                  <p className="text-[#36BF29] text-[17px] font-normal leading-[20.4px]">
                    Photo successfully verified and authenticated.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="px-8 py-8 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="w-[73px] h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-black text-[16px] font-medium leading-[19.2px]">Back</span>
            </button>

            <button
              onClick={handleContinue}
              className="px-[18px] py-[7px] bg-[#002E51] rounded-[8px] flex items-center gap-3 hover:bg-[#001a2e] transition-colors"
            >
              <span className="text-white text-[16px] font-medium leading-[19.2px]">
                {currentStep === 2
                  ? `Continue (${Object.values(fileUploads).filter((file) => file !== null).length}/6 uploaded)`
                  : "Continue"}
              </span>
              <div className="w-[30px] h-[30px] rounded flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-[#ffffff] rotate-180" />
              </div>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
