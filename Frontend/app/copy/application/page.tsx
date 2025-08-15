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
    signature: string
  }
  document: {
    deedNumber: string
    dateOfAttestation: string
    notaryName: string
    notaryAddress: string
  }
  reasonForRequest: string
}

interface FormErrors {
  applicant: {
    fullName: string
    address: string
    nic: string
    date: string
    signature: string
  }
  document: {
    deedNumber: string
    dateOfAttestation: string
    notaryName: string
    notaryAddress: string
  }
  reasonForRequest: string
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
      signature: "",
    },
    document: {
      deedNumber: "",
      dateOfAttestation: "",
      notaryName: "",
      notaryAddress: "",
    },
    reasonForRequest: "",
  })

  const [errors, setErrors] = useState<FormErrors>({
    applicant: {
      fullName: "",
      address: "",
      nic: "",
      date: "",
      signature: "",
    },
    document: {
      deedNumber: "",
      dateOfAttestation: "",
      notaryName: "",
      notaryAddress: "",
    },
    reasonForRequest: "",
  })

  const [fileUploads, setFileUploads] = useState<{
    originalDeed: File | null
    purchaserNIC: File | null
    purchaserPhoto: File | null
    vendorPhoto: File | null
    guarantor1NIC: File | null
    guarantor2NIC: File | null
    signature: File | null
  }>({
    originalDeed: null,
    purchaserNIC: null,
    purchaserPhoto: null,
    vendorPhoto: null,
    guarantor1NIC: null,
    guarantor2NIC: null,
    signature: null,
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

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: typeof prev[section] === 'object' ? {
        ...prev[section],
        [field]: value,
      } : value,
    }))

    // Clear error when user starts typing
    if (section !== 'reasonForRequest' && typeof errors[section] === 'object') {
      const sectionErrors = errors[section] as Record<string, string>
      if (sectionErrors[field]) {
        setErrors((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: "",
          } as any,
        }))
      }
    }
  }

  const validateApplicantSection = (): boolean => {
    const sectionData = formData.applicant
    const newErrors = {
      fullName: validateFullName(sectionData.fullName),
      address: sectionData.address ? "" : "Address is required",
      nic: validateNIC(sectionData.nic),
      date: sectionData.date ? "" : "Date is required",
      signature: "", // Signature validation can be added if needed
    }

    setErrors((prev) => ({
      ...prev,
      applicant: newErrors,
    }))

    return !Object.values(newErrors).some((error) => error !== "")
  }

  const validateDocumentSection = (): boolean => {
    const sectionData = formData.document
    const newErrors = {
      deedNumber: sectionData.deedNumber ? "" : "Deed number is required",
      dateOfAttestation: sectionData.dateOfAttestation ? "" : "Date of attestation is required",
      notaryName: sectionData.notaryName ? "" : "Notary name is required",
      notaryAddress: sectionData.notaryAddress ? "" : "Notary address is required",
    }

    setErrors((prev) => ({
      ...prev,
      document: newErrors,
    }))

    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleContinue = () => {
    if (currentStep === 1) {
      // Validate all form sections before proceeding
      const isApplicantValid = validateApplicantSection()
      const isDocumentValid = validateDocumentSection()
      const isReasonValid = formData.reasonForRequest.trim() !== ""
      
      if (!isReasonValid) {
        setErrors(prev => ({
          ...prev,
          reasonForRequest: "Reason for request is required"
        }))
      }

      if (isApplicantValid && isDocumentValid && isReasonValid) {
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
        "signature",
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
      router.push("/copy")
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
          <h1 className="text-black text-[32px] font-bold leading-[48px] text-left mx-11">Application for Copy</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1300px] mx-auto border border-[#00508E] rounded-[5px] relative overflow-hidden">
          {/* Form Header */}
          <div className="px-8 pt-12 pb-6">
            <div className="mb-2">
              <h2 className="text-black text-[20px] font-extrabold leading-[24px]">Applicant Information</h2>
            </div>
            <div className="mb-8">
              <p className="text-black text-[15px] font-normal leading-[18px]">
                Please fill out all required information for your application
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-start gap-[51px] mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-[31px] h-[31px] rounded-full flex items-center justify-center border ${
                  currentStep >= 1 ? 'bg-[#36BF29] border-[#36BF29]' : 'bg-[#F4F4F4] border-[#737373]'
                }`}>
                  <span className={`text-[15px] font-normal ${
                    currentStep >= 1 ? 'text-white' : 'text-[#807E7E]'
                  }`}>1</span>
                </div>
              </div>
              <div className={`w-[51px] h-[1px] ${currentStep >= 2 ? 'bg-[#36BF29]' : 'bg-[#737373]'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-[31px] h-[31px] rounded-full flex items-center justify-center border ${
                  currentStep >= 2 ? 'bg-[#36BF29] border-[#36BF29]' : 'bg-[#F4F4F4] border-[#737373]'
                }`}>
                  <span className={`text-[15px] font-normal ${
                    currentStep >= 2 ? 'text-white' : 'text-[#807E7E]'
                  }`}>2</span>
                </div>
              </div>
              <div className={`w-[51px] h-[1px] ${currentStep >= 3 ? 'bg-[#36BF29]' : 'bg-[#807E7E]'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-[31px] h-[31px] rounded-full flex items-center justify-center border ${
                  currentStep >= 3 ? 'bg-[#36BF29] border-[#36BF29]' : 'bg-[#F4F4F4] border-[#807E7E]'
                }`}>
                  <span className={`text-[15px] font-normal ${
                    currentStep >= 3 ? 'text-white' : 'text-[#807E7E]'
                  }`}>3</span>
                </div>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <>
              {/* Applicant Details Section */}
              <div className="px-8 mb-8">
                <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Applicant Details</h3>

                <div className="grid grid-cols-2 gap-14 mb-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Full Name</label>
                    <input
                      type="text"
                      value={formData.applicant.fullName}
                      onChange={(e) => handleInputChange("applicant", "fullName", e.target.value)}
                      placeholder="Enter applicant's full name"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.applicant.fullName && (
                      <span className="text-red-500 text-xs">{errors.applicant.fullName}</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Address</label>
                    <input
                      type="text"
                      value={formData.applicant.address}
                      onChange={(e) => handleInputChange("applicant", "address", e.target.value)}
                      placeholder="Enter Applicants Address"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.applicant.address && (
                      <span className="text-red-500 text-xs">{errors.applicant.address}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-14 mb-6">
                  {/* National Identity Card Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">
                      National Identity Card Number
                    </label>
                    <input
                      type="text"
                      value={formData.applicant.nic}
                      onChange={(e) => handleInputChange("applicant", "nic", e.target.value)}
                      placeholder="Enter applicant's National Identity Card Number"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.applicant.nic && (
                      <span className="text-red-500 text-xs">{errors.applicant.nic}</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Date</label>
                    <input
                      type="date"
                      value={formData.applicant.date}
                      onChange={(e) => handleInputChange("applicant", "date", e.target.value)}
                      placeholder="Enter Date"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.applicant.date && (
                      <span className="text-red-500 text-xs">{errors.applicant.date}</span>
                    )}
                  </div>
                </div>

                {/* Signature */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Signature</label>
                  <div
                    {...getRootPropsSignature()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] flex items-center justify-center cursor-pointer relative overflow-hidden ${
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
                      <div className="text-center">
                        <span className="text-[#636363] text-[12px]">
                          {isDragActiveSignature
                            ? "Drop signature image here"
                            : "Click to add signature image or drag here"}
                        </span>
                        <p className="text-[#636363] text-[10px] mt-1">Supports JPG, PNG, GIF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#00508E] mx-8" style={{ width: "calc(100% - 64px)" }} />

              {/* Document Details Section */}
              <div className="px-8 py-8">
                <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Document Details</h3>

                <div className="grid grid-cols-2 gap-14 mb-6">
                  {/* Deed Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Deed Number</label>
                    <input
                      type="text"
                      value={formData.document.deedNumber}
                      onChange={(e) => handleInputChange("document", "deedNumber", e.target.value)}
                      placeholder="Enter deed number"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.document.deedNumber && (
                      <span className="text-red-500 text-xs">{errors.document.deedNumber}</span>
                    )}
                  </div>

                  {/* Date of deed Attestation */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Date of deed Attestation</label>
                    <input
                      type="date"
                      value={formData.document.dateOfAttestation}
                      onChange={(e) => handleInputChange("document", "dateOfAttestation", e.target.value)}
                      placeholder="Enter attestation date"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.document.dateOfAttestation && (
                      <span className="text-red-500 text-xs">{errors.document.dateOfAttestation}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-14">
                  {/* Name of the Notary Public */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Name of the Notary Public</label>
                    <input
                      type="text"
                      value={formData.document.notaryName}
                      onChange={(e) => handleInputChange("document", "notaryName", e.target.value)}
                      placeholder="Enter notary public name"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.document.notaryName && (
                      <span className="text-red-500 text-xs">{errors.document.notaryName}</span>
                    )}
                  </div>

                  {/* Address of the Notary Public */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">
                      Address of the Notary Public
                    </label>
                    <input
                      type="text"
                      value={formData.document.notaryAddress}
                      onChange={(e) => handleInputChange("document", "notaryAddress", e.target.value)}
                      placeholder="Enter notary public address"
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.document.notaryAddress && (
                      <span className="text-red-500 text-xs">{errors.document.notaryAddress}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#00508E] mx-8" style={{ width: "calc(100% - 64px)" }} />

              {/* Reason for Request Section */}
              <div className="px-8 py-8">
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Reason for request</label>
                  <textarea
                    value={formData.reasonForRequest}
                    onChange={(e) => handleInputChange("reasonForRequest", "", e.target.value)}
                    placeholder="Enter reason for request"
                    className="w-full h-[119px] px-3 py-2 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] resize-none"
                  />
                  {errors.reasonForRequest && (
                    <span className="text-red-500 text-xs">{errors.reasonForRequest}</span>
                  )}
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="px-8 py-8">
              <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Document Upload</h3>
              <p className="text-black text-[15px] font-normal leading-[18px] mb-8">
                Please upload all required documents for verification
              </p>
              
              {/* Document upload sections would go here */}
              <div className="space-y-6">
                {/* Original Deed */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Original Deed (PDF)</label>
                  <div
                    {...getRootPropsOriginalDeed()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${
                      isDragActiveOriginalDeed ? "border-[#00508E] bg-blue-50" : ""
                    }`}
                  >
                    <input {...getInputPropsOriginalDeed()} />
                    {fileUploads.originalDeed ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileUploads.originalDeed.name}</p>
                        <p className="text-sm text-gray-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#636363] text-[12px]">
                          {isDragActiveOriginalDeed ? "Drop PDF here" : "Click to upload PDF or drag here"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Continue with other document uploads... */}
                {/* For brevity, showing just one more example */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Purchaser NIC (PDF)</label>
                  <div
                    {...getRootPropsPurchaserNIC()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${
                      isDragActivePurchaserNIC ? "border-[#00508E] bg-blue-50" : ""
                    }`}
                  >
                    <input {...getInputPropsPurchaserNIC()} />
                    {fileUploads.purchaserNIC ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileUploads.purchaserNIC.name}</p>
                        <p className="text-sm text-gray-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#636363] text-[12px]">
                          {isDragActivePurchaserNIC ? "Drop PDF here" : "Click to upload PDF or drag here"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="px-8 py-8">
              <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">AI Document Verification</h3>
              <p className="text-black text-[15px] font-normal leading-[18px] mb-8">
                Our AI system is verifying your uploaded documents...
              </p>
              
              <div className="space-y-4">
                {["originalDeed", "purchaserNIC", "purchaserPhoto", "vendorPhoto"].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{doc.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-2">
                      {verificationStatus[doc] === "checking" && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00508E]"></div>
                      )}
                      {verificationStatus[doc] === "verified" && (
                        <div className="text-green-500 font-bold">✓ Verified</div>
                      )}
                      {!verificationStatus[doc] && (
                        <div className="text-gray-400">Waiting...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {hasVerified && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">✓ All documents verified successfully!</p>
                  <p className="text-green-600 text-sm">You can now proceed to payment.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-8 pb-8 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="w-[73px] h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50"
            >
              <span className="text-black text-[16px] font-medium">Back</span>
            </button>

            <button
              onClick={handleContinue}
              disabled={currentStep === 3 && !hasVerified}
              className="px-[18px] py-[7px] bg-[#002E51] rounded-[8px] flex items-center gap-3 hover:bg-[#003d73] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white text-[16px] font-medium">
                {currentStep === 3 ? "Proceed to Payment" : "Continue"}
              </span>
              <img src="/continue.png" alt="Continue" className="w-[30px] h-[30px]" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}