"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import Footer from "@/components/footer"
import { useDropzone } from "react-dropzone"

interface FormData {
  applicant: {
    fullName: string
    address: string
    nic: string
    date: string
  }
  land: {
    district: string
    village: string
    landName: string
    extent: string
  }
  extract: {
    division: string
    volume: string
    folio: string
  }
  reason: string
}

interface FormErrors {
  applicant: {
    fullName: string
    address: string
    nic: string
    date: string
  }
  land: {
    district: string
    village: string
    landName: string
    extent: string
  }
  extract: {
    division: string
    volume: string
    folio: string
  }
  reason: string
}

export default function LandTransferApplicationPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    applicant: {
      fullName: "",
      address: "",
      nic: "",
      date: "",
    },
    land: {
      district: "",
      village: "",
      landName: "",
      extent: "",
    },
    extract: {
      division: "",
      volume: "",
      folio: "",
    },
    reason: "",
  })

  const [errors, setErrors] = useState<FormErrors>({
    applicant: {
      fullName: "",
      address: "",
      nic: "",
      date: "",
    },
    land: {
      district: "",
      village: "",
      landName: "",
      extent: "",
    },
    extract: {
      division: "",
      volume: "",
      folio: "",
    },
    reason: "",
  })

  const [fileUploads, setFileUploads] = useState<{
    originalDeed: File | null
    purchaserNIC: File | null
    purchaserPhoto: File | null
    vendorPhoto: File | null
    guarantor1NIC: File | null
    guarantor2NIC: File | null
  }>({
    originalDeed: null,
    purchaserNIC: null,
    purchaserPhoto: null,
    vendorPhoto: null,
    guarantor1NIC: null,
    guarantor2NIC: null,
  })

  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file for signature")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Signature image must be less than 5MB")
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setSignatureImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = handleSignatureUpload
    input.click()
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

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value.trim()) return `${fieldName} is required`
    return ""
  }

  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required"
    if (name.trim().length < 2) return "Full name must be at least 2 characters"
    if (name.trim().length > 100) return "Full name must be less than 100 characters"
    if (!/^[a-zA-Z\s.'-]+$/.test(name.trim()))
      return "Full name can only contain letters, spaces, dots, hyphens and apostrophes"
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

  const validateDate = (date: string): string => {
    if (!date) return "Date is required"
    const selectedDate = new Date(date)
    const today = new Date()

    if (selectedDate > today) {
      return "Date cannot be in the future"
    }

    return ""
  }

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    if (
      errors[section as keyof typeof errors] &&
      errors[section as keyof typeof errors][field as keyof typeof errors.applicant]
    ) {
      setErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: "",
        },
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      applicant: {
        fullName: validateFullName(formData.applicant.fullName),
        address: validateRequired(formData.applicant.address, "Address"),
        nic: validateNIC(formData.applicant.nic),
        date: validateDate(formData.applicant.date),
      },
      land: {
        district: validateRequired(formData.land.district, "District"),
        village: validateRequired(formData.land.village, "Village"),
        landName: validateRequired(formData.land.landName, "Land name"),
        extent: validateRequired(formData.land.extent, "Extent"),
      },
      extract: {
        division: validateRequired(formData.extract.division, "Division"),
        volume: validateRequired(formData.extract.volume, "Volume"),
        folio: validateRequired(formData.extract.folio, "Folio"),
      },
      reason: validateRequired(formData.reason, "Reason for request"),
    }

    setErrors(newErrors)

    // Check if signature is uploaded
    if (!signatureImage) {
      alert("Please upload your signature before submitting")
      return false
    }

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some((section) =>
      typeof section === "string" ? section !== "" : Object.values(section).some((error) => error !== ""),
    )

    return !hasErrors
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Navigate to confirmation page
      router.push("/copy-of-land/confirmation")
    } catch (error) {
      alert("An error occurred while submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = () => {
    if (currentStep === 1) {
      // Validate seller and buyer details before proceeding
      const isValid = validateForm()
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

      <main className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[75px]">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold leading-tight sm:leading-relaxed md:leading-[48px] text-left mx-12">
            Application for Copy of Land Registers
          </h1>
        </div>

        <div className="w-full max-w-[1300px] mx-auto border-[0.3px] border-[#00508E] rounded-[5px] relative overflow-hidden h-[1444px]">
          {/* Applicant Information Header */}
          <div className="absolute left-[31px] top-[21px] w-[512px]">
            <h2 className="text-black text-[20px] font-extrabold leading-[24px] font-inter">Applicant Information</h2>
          </div>

          {/* Instructions */}
          <div className="absolute left-[31px] top-[49px] w-[512px]">
            <p className="text-black text-[15px] font-normal leading-[18px] font-inter">
              Please fill all the required fields.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="absolute left-[31px] top-[130px] w-[281px] flex items-center justify-between">
            <div className="w-[31px] h-[31px] bg-[#36BF29] border border-[#36BF29] rounded-full flex items-center justify-center">
              <span className="text-white text-[15px] font-normal leading-[18px] font-inter">1</span>
            </div>
            <div className="w-[51px] h-0 border-t border-[#737373]"></div>
            <div className="w-[31px] h-[31px] bg-[#F4F4F4] border border-[#737373] rounded-full flex items-center justify-center">
              <span className="text-[#807E7E] text-[15px] font-normal leading-[18px] font-inter">2</span>
            </div>
            <div className="w-[51px] h-0 border-t border-[#807E7E]"></div>
            <div className="w-[31px] h-[31px] bg-[#F4F4F4] border border-[#807E7E] rounded-full flex items-center justify-center">
              <span className="text-[#807E7E] text-[15px] font-normal leading-[18px] font-inter">3</span>
            </div>
          </div>

          {/* Applicant Details Section */}
          <div className="absolute left-[30px] top-[192px] w-[1219px] flex flex-col gap-[13px]">
            <h3 className="text-black text-[20px] font-extrabold leading-[24px] font-inter">Applicant Details</h3>

            {/* First Row */}
            <div className="flex items-center gap-[56px] pb-[16px]">
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Applicants full name"
                  value={formData.applicant.fullName}
                  onChange={(e) => handleInputChange("applicant", "fullName", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.applicant.fullName ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.applicant.fullName && (
                  <span className="text-red-500 text-xs mt-1">{errors.applicant.fullName}</span>
                )}
              </div>
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Address</label>
                <input
                  type="text"
                  placeholder="Enter Applicants Address"
                  value={formData.applicant.address}
                  onChange={(e) => handleInputChange("applicant", "address", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.applicant.address ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.applicant.address && (
                  <span className="text-red-500 text-xs mt-1">{errors.applicant.address}</span>
                )}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between">
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">National Identity Card Number</label>
                <input
                  type="text"
                  placeholder="Enter Applicants NIC Number"
                  value={formData.applicant.nic}
                  onChange={(e) => handleInputChange("applicant", "nic", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.applicant.nic ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.applicant.nic && <span className="text-red-500 text-xs mt-1">{errors.applicant.nic}</span>}
              </div>
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Date</label>
                <input
                  type="date"
                  placeholder="Enter Date"
                  value={formData.applicant.date}
                  onChange={(e) => handleInputChange("applicant", "date", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.applicant.date ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.applicant.date && <span className="text-red-500 text-xs mt-1">{errors.applicant.date}</span>}
              </div>
            </div>

            {/* Signature Field */}
            <div className="flex flex-col gap-[7px]">
              <label className="text-black text-[13px] font-semibold font-inter">Signature</label>
              <div
                className="w-full h-[119px] bg-[#E9E9E9] rounded-[6px] cursor-pointer hover:bg-[#ddd] transition-colors flex items-center justify-center relative overflow-hidden"
                onClick={handleSignatureClick}
              >
                {signatureImage ? (
                  <img
                    src={signatureImage || "/placeholder.svg"}
                    alt="Signature"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center px-4">
                    <div className="text-[#636363] text-[14px] font-medium mb-1">Click to add signature</div>
                    <div className="text-[#888] text-[12px]">Upload image file (JPG, PNG, etc.)</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* First Divider */}
          <div className="absolute left-[31px] top-[597px] w-[1218px] h-0 border-t border-[#00508E]"></div>

          {/* Land Details Section */}
          <div className="absolute left-[31px] top-[626px] w-[1219px] flex flex-col gap-[13px]">
            <h3 className="text-black text-[20px] font-extrabold leading-[24px] font-inter">Land Details</h3>

            {/* First Row */}
            <div className="flex items-center gap-[56px] pb-[16px]">
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">
                  <span className="font-semibold">District </span>
                  <span className="font-light">(where the land is situated)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter district"
                  value={formData.land.district}
                  onChange={(e) => handleInputChange("land", "district", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.land.district ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.land.district && <span className="text-red-500 text-xs mt-1">{errors.land.district}</span>}
              </div>
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">
                  <span className="font-semibold">Village </span>
                  <span className="font-light">(Where the land is situated)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter village"
                  value={formData.land.village}
                  onChange={(e) => handleInputChange("land", "village", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.land.village ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.land.village && <span className="text-red-500 text-xs mt-1">{errors.land.village}</span>}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between">
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Name of the land</label>
                <input
                  type="text"
                  placeholder="Enter the name of the land"
                  value={formData.land.landName}
                  onChange={(e) => handleInputChange("land", "landName", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.land.landName ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.land.landName && <span className="text-red-500 text-xs mt-1">{errors.land.landName}</span>}
              </div>
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Extent</label>
                <input
                  type="text"
                  placeholder="Enter extent in perches"
                  value={formData.land.extent}
                  onChange={(e) => handleInputChange("land", "extent", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.land.extent ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.land.extent && <span className="text-red-500 text-xs mt-1">{errors.land.extent}</span>}
              </div>
            </div>
          </div>

          {/* Second Divider */}
          <div className="absolute left-[30px] top-[879px] w-[1218px] h-0 border-t border-[#00508E]"></div>

          {/* Reason for Request */}
          <div className="absolute left-[29px] top-[896px] w-[1219px] flex flex-col gap-[7px]">
            <label className="text-black text-[13px] font-semibold font-inter">Reason for the request</label>
            <textarea
              placeholder="Reason for the request"
              value={formData.reason}
              onChange={(e) => handleInputChange("extract", "reason", e.target.value)}
              className={`w-full h-[119px] px-[10px] py-[7px] bg-[#E9E9E9] rounded-[6px] text-black text-[13px] font-light font-inter border-none focus:outline-none resize-none ${
                errors.reason ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.reason && <span className="text-red-500 text-xs mt-1">{errors.reason}</span>}
          </div>

          {/* Third Divider */}
          <div className="absolute left-[30px] top-[1089px] w-[1218px] h-0 border-t border-[#00508E]"></div>

          {/* Extract Details Section */}
          <div className="absolute left-[29px] top-[1118px] w-[1219px] flex flex-col gap-[13px]">
            <h3 className="text-black text-[20px] font-extrabold leading-[24px] font-inter">Extract Details</h3>

            {/* First Row */}
            <div className="flex items-center gap-[56px] pb-[16px]">
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Division</label>
                <input
                  type="text"
                  placeholder="Enter Division"
                  value={formData.extract.division}
                  onChange={(e) => handleInputChange("extract", "division", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.extract.division ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.extract.division && (
                  <span className="text-red-500 text-xs mt-1">{errors.extract.division}</span>
                )}
              </div>
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Volume</label>
                <input
                  type="text"
                  placeholder="Enter volume"
                  value={formData.extract.volume}
                  onChange={(e) => handleInputChange("extract", "volume", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.extract.volume ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.extract.volume && <span className="text-red-500 text-xs mt-1">{errors.extract.volume}</span>}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between">
              <div className="w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-[13px] font-semibold font-inter">Folio</label>
                <input
                  type="text"
                  placeholder="Enter the name of the land"
                  value={formData.extract.folio}
                  onChange={(e) => handleInputChange("extract", "folio", e.target.value)}
                  className={`w-full h-[39px] px-[10px] bg-[#E9E9E9] rounded-[6px] text-[#636363] text-[12px] font-normal font-inter border-none focus:outline-none ${
                    errors.extract.folio ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.extract.folio && <span className="text-red-500 text-xs mt-1">{errors.extract.folio}</span>}
              </div>
              <div className="w-[581px] h-[39px]"></div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute left-[29px] top-[1349px] w-[1206px] flex justify-between items-center my-7">
            <button className="w-[73px] h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors">
              <span className="text-black text-[16px] font-medium font-inter">Back</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-[18px] py-[7px] rounded-[8px] flex items-center gap-[12px] transition-colors ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#002E51] hover:bg-[#001a2e]"
              }`}
            >
              <span className="text-white text-[16px] font-medium font-inter">
                {isSubmitting ? "Submitting..." : "Submit"}
              </span>
              {!isSubmitting && <img src="/continue.png" alt="Arrow" className="w-[30px] h-[30px]" />}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}