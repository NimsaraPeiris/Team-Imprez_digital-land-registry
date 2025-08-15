"use client"
import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import Footer from "@/components/footer"
import { useDropzone } from "react-dropzone"

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
    originalDeed: File | null
    purchaserNIC: File | null
    purchaserPhoto: File | null
    vendorPhoto: File | null
    guarantor1NIC: File | null
    guarantor2NIC: File | null
    signature: File | null // Added signature to fileUploads state
  }>({
    originalDeed: null,
    purchaserNIC: null,
    purchaserPhoto: null,
    vendorPhoto: null,
    guarantor1NIC: null,
    guarantor2NIC: null,
    signature: null, // Added signature to initial state
  })

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

  const onDropSignature = useCallback((acceptedFiles: File[]) => {
    setFileUploads((prevState) => ({ ...prevState, signature: acceptedFiles[0] }))
  }, [])

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
        "signature", // Added signature to required documents
      ] as const
      const allDocumentsUploaded = requiredDocuments.every((doc) => fileUploads[doc] !== null)

      if (allDocumentsUploaded) {
        // Move to AI verification step (step 3)
        setCurrentStep(3)
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

  const {
    getRootProps: getRootPropsOriginalDeed,
    getInputProps: getInputPropsOriginalDeed,
    isDragActive: isDragActiveOriginalDeed,
  } = useDropzone({
    onDrop: onDropOriginalDeed,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
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
    },
  })
  const {
    getRootProps: getRootPropsSignature,
    getInputProps: getInputPropsSignature,
    isDragActive: isDragActiveSignature,
  } = useDropzone({
    onDrop: onDropSignature,
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
  })

  const [verificationStatus, setVerificationStatus] = useState<{ [key: string]: "checking" | "verified" }>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)

  useEffect(() => {
    if (currentStep === 3 && !isVerifying && !hasVerified) {
      setIsVerifying(true)
      const documents = ["originalDeed", "purchaserNIC", "purchaserPhoto", "vendorPhoto"]

      documents.forEach((doc, index) => {
        setTimeout(() => {
          setVerificationStatus((prev) => ({ ...prev, [doc]: "checking" }))

          setTimeout(() => {
            setVerificationStatus((prev) => ({ ...prev, [doc]: "verified" }))
          }, 2000)
        }, index * 500)
      })

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
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      <main className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-[75px]">
        <div className="mb-6 lg:mb-10">
          <h1 className="text-black text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight lg:leading-[48px] font-inter text-left">
            Application for search Duplicate of Deeds
          </h1>
        </div>

        <div className="w-full max-w-full border-[0.3px] border-[#00508E] rounded-[5px] bg-white p-4 sm:p-6 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight sm:leading-relaxed lg:leading-[24px] font-inter mb-2">
              Applicant Information
            </h2>
            <p className="text-black text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed lg:leading-[18px] font-inter">
              Please upload all required documents for verification
            </p>
          </div>

          <div className="flex items-center justify-start gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12 max-w-sm">
            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-[31px] lg:h-[31px] bg-[#36BF29] rounded-full border border-[#36BF29] flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm lg:text-[15px] font-normal leading-[18px] font-inter">
                1
              </span>
            </div>
            <div className="w-8 sm:w-10 lg:w-[51px] h-0 border-t border-[#737373]"></div>

            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-[31px] lg:h-[31px] bg-[#F4F4F4] rounded-full border border-[#737373] flex items-center justify-center">
              <span className="text-[#807E7E] text-xs sm:text-sm lg:text-[15px] font-normal leading-[18px] font-inter">
                2
              </span>
            </div>
            <div className="w-8 sm:w-10 lg:w-[51px] h-0 border-t border-[#807E7E]"></div>

            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-[31px] lg:h-[31px] bg-[#F4F4F4] rounded-full border border-[#807E7E] flex items-center justify-center">
              <span className="text-[#807E7E] text-xs sm:text-sm lg:text-[15px] font-normal leading-[18px] font-inter">
                3
              </span>
            </div>
          </div>

          <div className="mb-8 lg:mb-12">
            <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter mb-4 lg:mb-6">
              Applicant Details
            </h3>

            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Applicants full name"
                    value={formData.seller.fullName}
                    onChange={(e) => handleInputChange("seller", "fullName", e.target.value)}
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                  {errors.seller.fullName && (
                    <p className="text-red-500 text-xs sm:text-sm lg:text-[12px] font-inter">
                      {errors.seller.fullName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter applicants address"
                    value={formData.seller.email}
                    onChange={(e) => handleInputChange("seller", "email", e.target.value)}
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                  {errors.seller.email && (
                    <p className="text-red-500 text-xs sm:text-sm lg:text-[12px] font-inter">{errors.seller.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    National Identity Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Applicants NIC number"
                    value={formData.seller.phone}
                    onChange={(e) => handleInputChange("seller", "phone", e.target.value)}
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                  {errors.seller.phone && (
                    <p className="text-red-500 text-xs sm:text-sm lg:text-[12px] font-inter">{errors.seller.phone}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Id</label>
                  <input
                    type="text"
                    placeholder="Enter seller's full name"
                    value={formData.seller.nic}
                    onChange={(e) => handleInputChange("seller", "nic", e.target.value)}
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                  {errors.seller.nic && (
                    <p className="text-red-500 text-xs sm:text-sm lg:text-[12px] font-inter">{errors.seller.nic}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Date of application
                  </label>
                  <input
                    type="date"
                    placeholder="Enter date of application"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 lg:gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  Signature
                </label>
                <div
                  {...getRootPropsSignature()}
                  className={`w-full h-24 sm:h-28 lg:h-[119px] bg-[#E9E9E9] rounded-[6px] flex items-center justify-center relative overflow-hidden border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] cursor-pointer ${
                    isDragActiveSignature ? "ring-2 ring-[#00508E]" : ""
                  }`}
                >
                  <input {...getInputPropsSignature()} />
                  {fileUploads.signature ? (
                    <div className="relative w-full h-full">
                      <img
                        src={URL.createObjectURL(fileUploads.signature) || "/placeholder.svg"}
                        alt="Signature"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setFileUploads((prev) => ({ ...prev, signature: null }))
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <div className="text-[#636363] text-xs sm:text-sm font-inter font-medium mb-1">
                        {isDragActiveSignature
                          ? "Drop signature image here"
                          : "Click to add signature image or drag here"}
                      </div>
                      <p className="text-[#636363] text-[10px] font-inter">Supports JPG, PNG, GIF</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-0 border-t border-[#00508E] mb-8 lg:mb-12"></div>

          <div className="mb-8 lg:mb-12">
            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Notary Public name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the name of the notary public who attested the deed"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    District or Station of Notary Public
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the District or station where the Notary Public practiced at the time."
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Number of the deed
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the number of the deed"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Date of the deed
                  </label>
                  <input
                    type="date"
                    placeholder="Enter the date or probable period of the deed"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Name of the granter/transferor
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the name of the granter/transferor"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Name of the grantee/transferee
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the name of the grantee/transferee"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Village
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the village where the land is located"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Name of the Land
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the name of the land"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Extent of the land
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the extent of the land"
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
                <div className="flex flex-col gap-1 lg:gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                    Korale/Pattu/GN Division/DS Divison
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 lg:mb-12">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col gap-1 lg:gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  Reason for Search
                </label>
                <textarea
                  placeholder="Enter reason for search"
                  rows={4}
                  className="w-full h-24 sm:h-28 lg:h-[119px] px-2 lg:px-[10px] py-2 bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter resize-none"
                />
              </div>

              <div className="flex flex-col gap-1 lg:gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  If for a court case, the case number
                </label>
                <input
                  type="text"
                  placeholder="Enter case number if applicable"
                  className="w-full h-8 sm:h-9 lg:h-[39px] px-2 lg:px-[10px] bg-[#E9E9E9] rounded-[6px] text-xs sm:text-sm lg:text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] font-inter"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-4 border-t border-gray-200">
            <button
              className="w-full sm:w-auto px-4 sm:px-[18px] py-2 sm:py-[12px] lg:w-[73px] lg:h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors"
              onClick={handleBack}
            >
              <span className="text-black text-sm sm:text-base lg:text-[16px] font-medium font-inter">Back</span>
            </button>

            <button
              className="w-full sm:w-auto px-4 sm:px-[18px] py-2 sm:py-[7px] bg-[#002E51] rounded-[8px] flex items-center justify-center gap-3 lg:gap-[12px] hover:bg-[#001a2e] transition-colors"
              onClick={handleContinue}
            >
              <span className="text-white text-sm sm:text-base lg:text-[16px] font-medium font-inter">Continue</span>
              <img
                src="/continue.png"
                alt="Arrow"
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[30px] lg:h-[30px] rotate-180 scale-x-[-1]"
              />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
