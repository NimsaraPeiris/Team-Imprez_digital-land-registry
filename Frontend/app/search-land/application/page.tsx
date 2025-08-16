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
  seller: {
    fullName: string
    email: string
    phone: string
    nic: string
    address: string
    date: string
  }
  property: {
    village: string
    nameOfLand: string
    extent: string
    korale: string
    pattu: string
    gnDivision: string
    dsDivision: string
    division: string
    volumeNo: string
    folioNo: string
  }
}

interface FormErrors {
  seller: {
    fullName: string
    email: string
    phone: string
    nic: string
    address: string
    date: string
  }
  property: {
    village: string
    nameOfLand: string
    extent: string
    korale: string
    pattu: string
    gnDivision: string
    dsDivision: string
    division: string
    volumeNo: string
    folioNo: string
  }
}

export default function LandTransferApplicationPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [signature, setSignature] = useState<string | null>(null)

  const [registerEntries, setRegisterEntries] = useState([{ id: 1, division: "", volumeNo: "", folioNo: "" }])

  const [formData, setFormData] = useState<FormData>({
    seller: {
      fullName: "",
      email: "",
      phone: "",
      nic: "",
      address: "",
      date: "",
    },
    property: {
      village: "",
      nameOfLand: "",
      extent: "",
      korale: "",
      pattu: "",
      gnDivision: "",
      dsDivision: "",
      division: "",
      volumeNo: "",
      folioNo: "",
    },
  })

  const [errors, setErrors] = useState<FormErrors>({
    seller: {
      fullName: "",
      email: "",
      phone: "",
      nic: "",
      address: "",
      date: "",
    },
    property: {
      village: "",
      nameOfLand: "",
      extent: "",
      korale: "",
      pattu: "",
      gnDivision: "",
      dsDivision: "",
      division: "",
      volumeNo: "",
      folioNo: "",
    },
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
    const file = acceptedFiles[0]
    if (file) {
      setFileUploads((prevState) => ({ ...prevState, signature: file }))

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setSignature(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
      "70", "71", "72", "74", "75", "76", "77", "78",
      "11", "21", "23", "24", "25", "26", "27",
      "31", "32", "33", "34", "35", "36", "37", "38",
      "41", "45", "47", "51", "52", "54", "55", "57",
      "63", "65", "66", "67", "81", "91",
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

  const handleInputChange = (section: "seller" | "property", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: "",
      },
    }))
  }

  const validateSection = (section: "seller" | "property"): boolean => {
    if (section === "seller") {
      const sectionData = formData.seller
      const newErrors = {
        fullName: validateFullName(sectionData.fullName),
        email: "", // Make email optional for this form
        phone: "", // Make phone optional for this form  
        nic: validateNIC(sectionData.nic),
        address: sectionData.address.trim() ? "" : "Address is required",
        date: sectionData.date ? "" : "Date is required",
      }

      setErrors((prev) => ({
        ...prev,
        seller: newErrors,
      }))

      return !Object.values(newErrors).some((error) => error !== "")
    } else if (section === "property") {
      const sectionData = formData.property
      const newErrors = {
        village: sectionData.village.trim() ? "" : "Village is required",
        nameOfLand: sectionData.nameOfLand.trim() ? "" : "Name of land is required",
        extent: sectionData.extent.trim() ? "" : "Extent is required",
        korale: sectionData.korale.trim() ? "" : "Korale is required",
        pattu: sectionData.pattu.trim() ? "" : "Pattu is required",
        gnDivision: sectionData.gnDivision.trim() ? "" : "GN Division is required",
        dsDivision: sectionData.dsDivision.trim() ? "" : "DS Division is required",
        division: "", // Will be validated through register entries
        volumeNo: "", // Will be validated through register entries
        folioNo: "", // Will be validated through register entries
      }

      setErrors((prev) => ({
        ...prev,
        property: newErrors,
      }))

      return !Object.values(newErrors).some((error) => error !== "")
    }
    return true
  }

  const validateRegisterEntries = (): boolean => {
    // Check if at least one register entry is completely filled
    const hasValidEntry = registerEntries.some(entry => 
      entry.division.trim() && entry.volumeNo.trim() && entry.folioNo.trim()
    )
    
    if (!hasValidEntry) {
      alert("Please fill at least one complete register entry (Division, Vol.No, and Folio No)")
      return false
    }
    
    return true
  }

  const handleContinue = () => {
    console.log("Continue button clicked, current step:", currentStep)
    
    if (currentStep === 1) {
      // Validate seller and property details before proceeding
      const isSellerValid = validateSection("seller")
      const isPropertyValid = validateSection("property")
      const isRegisterValid = validateRegisterEntries()
      
      console.log("Validation results:", { isSellerValid, isPropertyValid, isRegisterValid })
      
      if (isSellerValid && isPropertyValid && isRegisterValid) {
        console.log("All validations passed, moving to step 2")
        setCurrentStep(2)
      } else {
        console.log("Validation failed")
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
        setCurrentStep(3)
      } else {
        alert("Please upload all required documents before continuing.")
      }
    } else if (currentStep === 3) {
      // Navigate to online payment section
      router.push("/search-land/payment")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/search-land")
    }
  }

  const handleFileUpload = (fileType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileUploads((prev) => ({ ...prev, [fileType]: file }))
    }
  }

  const removeSignature = () => {
    setSignature(null)
    setFileUploads((prevState) => ({ ...prevState, signature: null }))
  }

  const addRegisterEntry = () => {
    if (registerEntries.length < 8) {
      const newId = Math.max(...registerEntries.map((entry) => entry.id)) + 1
      setRegisterEntries([...registerEntries, { id: newId, division: "", volumeNo: "", folioNo: "" }])
    }
  }

  const removeRegisterEntry = (id: number) => {
    if (registerEntries.length > 1) {
      setRegisterEntries(registerEntries.filter((entry) => entry.id !== id))
    }
  }

  const handleRegisterInputChange = (id: number, field: string, value: string) => {
    setRegisterEntries(registerEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
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

      <main className="py-8 px-4 sm:px-6 lg:px-[75px] mx-auto my-auto">
        <div className="w-full flex justify-start mb-8">
          <div className="flex flex-col justify-center text-black/80 text-[32px] font-bold leading-[48px] font-inter text-left mx-12">
            Application for Search of Land Registers
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1300px] mx-auto border border-[#00508E] rounded-[5px] relative bg-white overflow-hidden">
          
          {/* Step 1: Form Fields */}
          {currentStep === 1 && (
            <>
              {/* Applicant Information Header */}
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

              {/* Applicant Details Section */}
              <div className="px-8 mb-8">
                <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Applicant Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter applicant's full name"
                      value={formData.seller.fullName}
                      onChange={(e) => handleInputChange("seller", "fullName", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.seller.fullName && (
                      <span className="text-red-500 text-xs">{errors.seller.fullName}</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Address</label>
                    <input
                      type="text"
                      placeholder="Enter Applicants Address"
                      value={formData.seller.address}
                      onChange={(e) => handleInputChange("seller", "address", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.seller.address && (
                      <span className="text-red-500 text-xs">{errors.seller.address}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-6">
                  {/* National Identity Card Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">
                      National Identity Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter applicant's National Identity Card Number"
                      value={formData.seller.nic}
                      onChange={(e) => handleInputChange("seller", "nic", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.seller.nic && (
                      <span className="text-red-500 text-xs">{errors.seller.nic}</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Date</label>
                    <input
                      type="date"
                      value={formData.seller.date}
                      onChange={(e) => handleInputChange("seller", "date", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.seller.date && (
                      <span className="text-red-500 text-xs">{errors.seller.date}</span>
                    )}
                  </div>
                </div>

                {/* Signature Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Signature</label>
                  <div
                    {...getRootPropsSignature()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] flex items-center justify-center cursor-pointer relative overflow-hidden ${
                      isDragActiveSignature ? "ring-2 ring-[#00508E]" : ""
                    }`}
                  >
                    <input {...getInputPropsSignature()} />
                    {signature ? (
                      <div className="relative w-full h-full">
                        <img
                          src={signature || "/placeholder.svg"}
                          alt="Signature"
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSignature()
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

              {/* Property Details Section */}
              <div className="px-8 py-8">
                <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Property Details</h3>

                {/* First Row - Village and Name of Land */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">
                      Village <span className="font-light">(where the land is located)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter village name"
                      value={formData.property.village}
                      onChange={(e) => handleInputChange("property", "village", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.village && (
                      <span className="text-red-500 text-xs">{errors.property.village}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Name of the Land</label>
                    <input
                      type="text"
                      placeholder="Enter Land name"
                      value={formData.property.nameOfLand}
                      onChange={(e) => handleInputChange("property", "nameOfLand", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.nameOfLand && (
                      <span className="text-red-500 text-xs">{errors.property.nameOfLand}</span>
                    )}
                  </div>
                </div>

                {/* Second Row - Extent and Korale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Extent of the land</label>
                    <input
                      type="text"
                      placeholder="Enter extent of the land"
                      value={formData.property.extent}
                      onChange={(e) => handleInputChange("property", "extent", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.extent && (
                      <span className="text-red-500 text-xs">{errors.property.extent}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Korale</label>
                    <input
                      type="text"
                      placeholder="Enter Korale name"
                      value={formData.property.korale}
                      onChange={(e) => handleInputChange("property", "korale", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.korale && (
                      <span className="text-red-500 text-xs">{errors.property.korale}</span>
                    )}
                  </div>
                </div>

                {/* Third Row - Pattu and GN Division */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">Pattu</label>
                    <input
                      type="text"
                      placeholder="Enter pattu name"
                      value={formData.property.pattu}
                      onChange={(e) => handleInputChange("property", "pattu", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.pattu && (
                      <span className="text-red-500 text-xs">{errors.property.pattu}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">GN Division</label>
                    <input
                      type="text"
                      placeholder="Enter GN Division"
                      value={formData.property.gnDivision}
                      onChange={(e) => handleInputChange("property", "gnDivision", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.gnDivision && (
                      <span className="text-red-500 text-xs">{errors.property.gnDivision}</span>
                    )}
                  </div>
                </div>

                {/* Fourth Row - DS Division */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-black text-[13px] font-semibold leading-[22px]">DS Division</label>
                    <input
                      type="text"
                      placeholder="Enter DS Division"
                      value={formData.property.dsDivision}
                      onChange={(e) => handleInputChange("property", "dsDivision", e.target.value)}
                      className="w-full h-[39px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                    />
                    {errors.property.dsDivision && (
                      <span className="text-red-500 text-xs">{errors.property.dsDivision}</span>
                    )}
                  </div>
                  <div className="w-full"></div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#00508E] mx-8" style={{ width: "calc(100% - 64px)" }} />

              {/* Registers Required for Search Section */}
              <div className="px-8 py-8">
                <label className="text-black text-[20px] font-extrabold leading-[24px] mb-6 block">
                  Registers Required for Search
                </label>

                <div className="space-y-6">
                  {registerEntries.map((entry, index) => (
                    <div key={entry.id} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                      {/* Division Field */}
                      <div className="flex-1 min-w-0">
                        <label className="text-black text-[13px] font-normal leading-[22px] block mb-2">
                          Division
                        </label>
                        <input
                          type="text"
                          placeholder="Enter division"
                          value={entry.division}
                          onChange={(e) => handleRegisterInputChange(entry.id, "division", e.target.value)}
                          className="w-full h-[35px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                        />
                      </div>

                      {/* Vol.No Field */}
                      <div className="flex-1 min-w-0">
                        <label className="text-black text-[13px] font-normal leading-[22px] block mb-2">
                          Vol.No
                        </label>
                        <input
                          type="text"
                          placeholder="Enter volume number"
                          value={entry.volumeNo}
                          onChange={(e) => handleRegisterInputChange(entry.id, "volumeNo", e.target.value)}
                          className="w-full h-[35px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                        />
                      </div>

                      {/* Folio No Field */}
                      <div className="flex-1 min-w-0">
                        <label className="text-black text-[13px] font-normal leading-[22px] block mb-2">
                          Folio No
                        </label>
                        <input
                          type="text"
                          placeholder="Enter folio number"
                          value={entry.folioNo}
                          onChange={(e) => handleRegisterInputChange(entry.id, "folioNo", e.target.value)}
                          className="w-full h-[35px] px-3 bg-[#E9E9E9] rounded-[6px] text-[12px] text-[#636363] placeholder-[#636363] border-none focus:outline-none focus:ring-2 focus:ring-[#00508E]"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 items-center">
                        {/* Add More Button - only show on last entry and if less than 8 entries */}
                        {index === registerEntries.length - 1 && registerEntries.length < 8 && (
                          <button
                            onClick={addRegisterEntry}
                            className="h-[34px] px-4 bg-[#002E51] rounded-[5px] border border-[#002E51] flex items-center justify-center cursor-pointer hover:bg-[#001a2e] transition-colors"
                          >
                            <span className="text-white text-[12px] font-normal">Add More</span>
                            <div className="w-[14px] h-[14px] ml-2 flex items-center justify-center relative">
                              <div className="w-[1px] h-[14px] bg-white"></div>
                              <div className="w-[14px] h-[1px] bg-white absolute"></div>
                            </div>
                          </button>
                        )}

                        {/* Remove Button - only show if more than 1 entry */}
                        {registerEntries.length > 1 && (
                          <button
                            onClick={() => removeRegisterEntry(entry.id)}
                            className="w-[34px] h-[34px] bg-red-500 rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                            title="Remove this register entry"
                          >
                            <span className="text-white text-lg font-bold">×</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Entry Counter */}
                  <div className="text-sm text-gray-500 mt-4 text-center">
                    {registerEntries.length} of 8 register entries
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div className="px-8 py-8">
              <h3 className="text-black text-[20px] font-extrabold leading-[24px] mb-4">Document Upload</h3>
              <p className="text-black text-[15px] font-normal leading-[18px] mb-8">
                Please upload all required documents for verification
              </p>
              
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

                {/* Purchaser NIC */}
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

                {/* Continue with other document uploads */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Purchaser Photo (PDF)</label>
                  <div
                    {...getRootPropsPurchaserPhoto()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${
                      isDragActivePurchaserPhoto ? "border-[#00508E] bg-blue-50" : ""
                    }`}
                  >
                    <input {...getInputPropsPurchaserPhoto()} />
                    {fileUploads.purchaserPhoto ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileUploads.purchaserPhoto.name}</p>
                        <p className="text-sm text-gray-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#636363] text-[12px]">
                          {isDragActivePurchaserPhoto ? "Drop PDF here" : "Click to upload PDF or drag here"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Photo */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Vendor Photo (PDF)</label>
                  <div
                    {...getRootPropsVendorPhoto()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${
                      isDragActiveVendorPhoto ? "border-[#00508E] bg-blue-50" : ""
                    }`}
                  >
                    <input {...getInputPropsVendorPhoto()} />
                    {fileUploads.vendorPhoto ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileUploads.vendorPhoto.name}</p>
                        <p className="text-sm text-gray-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#636363] text-[12px]">
                          {isDragActiveVendorPhoto ? "Drop PDF here" : "Click to upload PDF or drag here"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guarantor 1 NIC */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Guarantor 1 NIC (PDF)</label>
                  <div
                    {...getRootPropsGuarantor1NIC()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${
                      isDragActiveGuarantor1NIC ? "border-[#00508E] bg-blue-50" : ""
                    }`}
                  >
                    <input {...getInputPropsGuarantor1NIC()} />
                    {fileUploads.guarantor1NIC ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileUploads.guarantor1NIC.name}</p>
                        <p className="text-sm text-gray-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#636363] text-[12px]">
                          {isDragActiveGuarantor1NIC ? "Drop PDF here" : "Click to upload PDF or drag here"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guarantor 2 NIC */}
                <div className="flex flex-col gap-2">
                  <label className="text-black text-[13px] font-semibold leading-[22px]">Guarantor 2 NIC (PDF)</label>
                  <div
                    {...getRootPropsGuarantor2NIC()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${
                      isDragActiveGuarantor2NIC ? "border-[#00508E] bg-blue-50" : ""
                    }`}
                  >
                    <input {...getInputPropsGuarantor2NIC()} />
                    {fileUploads.guarantor2NIC ? (
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{fileUploads.guarantor2NIC.name}</p>
                        <p className="text-sm text-gray-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#636363] text-[12px]">
                          {isDragActiveGuarantor2NIC ? "Drop PDF here" : "Click to upload PDF or drag here"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: AI Verification */}
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
              className="w-[73px] h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-black text-[16px] font-medium">Back</span>
            </button>

            <button
              onClick={handleContinue}
              disabled={currentStep === 3 && !hasVerified}
              className="px-[18px] py-[7px] bg-[#002E51] rounded-[8px] flex items-center gap-3 hover:bg-[#003d73] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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