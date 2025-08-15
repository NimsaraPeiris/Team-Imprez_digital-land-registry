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
    signature: File | null // Added signature to fileUploads state
  }>({
    originalDeed: null,
    purchaserNIC: null,
    purchaserPhoto: null,
    vendorPhoto: null,
    guarantor1NIC: null,
    guarantor2NIC: null,
    signature: null, // Added signature to fileUploads state
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
        email: validateEmail(sectionData.email),
        phone: validatePhoneNumber(sectionData.phone),
        nic: validateNIC(sectionData.nic),
      }

      setErrors((prev) => ({
        ...prev,
        seller: newErrors,
      }))

      return !Object.values(newErrors).some((error) => error !== "")
    } else {
      // For property section, we don't have specific validation yet
      // We could add validation for specific fields if needed
      return true
    }
  }

  const handleContinue = () => {
  if (currentStep === 1) {
    // Validate seller information
    const sellerData = formData.seller;
    const sellerErrors = {
      fullName: validateFullName(sellerData.fullName),
      email: validateEmail(sellerData.email),
      phone: validatePhoneNumber(sellerData.phone),
      nic: validateNIC(sellerData.nic),
    };

    // Validate property information (basic required field validation)
    const propertyData = formData.property;
    const propertyErrors = {
      village: !propertyData.village.trim() ? "Village is required" : "",
      nameOfLand: !propertyData.nameOfLand.trim() ? "Name of land is required" : "",
      extent: !propertyData.extent.trim() ? "Extent is required" : "",
      korale: !propertyData.korale.trim() ? "Korale is required" : "",
      pattu: !propertyData.pattu.trim() ? "Pattu is required" : "",
      gnDivision: !propertyData.gnDivision.trim() ? "GN Division is required" : "",
      dsDivision: !propertyData.dsDivision.trim() ? "DS Division is required" : "",
      division: "", // This might not be required at this step
      volumeNo: "",
      folioNo: "",
    };

    // Validate register entries
    const registerErrors = registerEntries.some(entry => 
      !entry.division.trim() || !entry.volumeNo.trim() || !entry.folioNo.trim()
    );

    // Update errors state
    setErrors(prev => ({
      ...prev,
      seller: sellerErrors,
      property: propertyErrors,
    }));

    // Check if there are any errors
    const hasSellerErrors = Object.values(sellerErrors).some(error => error !== "");
    const hasPropertyErrors = Object.values(propertyErrors).some(error => error !== "");
    
    if (hasSellerErrors) {
      alert("Please fix the errors in Applicant Details section");
      return;
    }
    
    if (hasPropertyErrors) {
      alert("Please fill in all required Property Details fields");
      return;
    }
    
    if (registerErrors) {
      alert("Please fill in all register entry fields (Division, Vol.No, and Folio No)");
      return;
    }

    // All validations passed, proceed to step 2
    setCurrentStep(2);
    
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
    ] as const;
    
    const allDocumentsUploaded = requiredDocuments.every(doc => fileUploads[doc] !== null);

    if (allDocumentsUploaded) {
      // Move to AI verification step (step 3)
      setCurrentStep(3);
    } else {
      const missingDocs = requiredDocuments.filter(doc => fileUploads[doc] === null);
      alert(`Please upload all required documents before continuing. Missing: ${missingDocs.join(', ')}`);
    }
    
  } else if (currentStep === 3) {
    // Navigate to online payment section
    router.push("/search-land/payment");
  }
};

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/search-land")
    }
  }

  const steps = [1, 2, 3, 4, 5]

  const handleFileUpload = (fileType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileUploads((prev) => ({ ...prev, [fileType]: file }))
    }
  }

  const removeSignature = () => {
    setSignature(null)
    setFileUploads((prevState) => ({ ...prevState, signature: null })) // Also clear from fileUploads state
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
        <div
          className="w-full max-w-[1300px] mx-auto border-[0.3px] border-[#00508E] rounded-[5px] relative bg-white my-auto"
          style={{
            minHeight: `${1400 + (registerEntries.length - 1) * 100}px`,
            height: "auto",
          }}
        >
          {/* Applicant Information Header */}
          <div className="absolute left-4 sm:left-6 lg:left-[31px] top-8 sm:top-10 lg:top-[49px] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[512px] flex flex-col gap-[8px]">
            <h2 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
              Applicant Information
            </h2>
            <p className="text-black text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed lg:leading-[18px] font-inter">
              Please upload all required documents for verification
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="absolute left-4 sm:left-6 lg:left-[31px] top-24 sm:top-28 lg:top-[130px] w-[200px] sm:w-[220px] lg:w-[248px] flex items-center justify-between">
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

          {/* Applicant Details Section */}
          <div className="absolute left-4 sm:left-6 lg:left-[31px] top-40 sm:top-44 lg:top-[192px] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[1219px] flex flex-col gap-[13px]">
            <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
              Applicant Details
            </h3>

            {/* First Row - Full Name and Address */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-[56px] pb-4">
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  Full Name
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter applicant's full name"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("seller", "fullName", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Address</label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter Applicants Address"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Second Row - NIC and Date */}
            <div className="flex items-center justify-between">
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  National Identity Card Number
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter applicant's National Identity Card Number"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("seller", "nic", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Date</label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="date"
                    placeholder="Enter Date"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Signature Field */}
            <div className="flex flex-col gap-[7px]">
              <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Signature</label>
              <div
                {...getRootPropsSignature()} // Using dropzone props instead of onClick
                className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] relative overflow-hidden border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] flex items-center justify-center cursor-pointer ${
                  isDragActiveSignature ? "bg-blue-50 ring-2 ring-[#00508E]" : ""
                }`} // Removed hover effects and dashed border, added drag feedback
              >
                <input {...getInputPropsSignature()} /> {/* Using dropzone input props */}
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
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors px-3 sm:px-4"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center px-0 my-9">
                    <div className="text-[#636363] text-[14px] font-medium mb-1 py-0">
                      {isDragActiveSignature ? "Drop signature image here" : "Click to add signature or drag here"}{" "}
                      {/* Added drag feedback text */}
                    </div>
                    <div className="text-[#888] text-[12px] my-0">Upload image file (JPG, PNG, GIF)</div>{" "}
                    {/* Updated supported formats */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blue Divider Line */}
          <div className="absolute left-4 sm:left-6 lg:left-[31px] top-[597px] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[1218px] h-0 border-t border-[#00508E]"></div>

          {/* Property Details Section */}
          <div className="absolute left-4 sm:left-6 lg:left-[31px] top-[626px] flex flex-col gap-[13px]">
            <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
              Property Details
            </h3>

            {/* First Row - Village and Name of Land */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-[56px] pb-4">
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  Village <span className="font-light">(where the land is located)</span>
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter village name"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "village", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  Name of the Land
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter Land name"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "nameOfLand", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Second Row - Extent and Korale */}
            <div className="flex items-center justify-between h-[68px]">
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  Extent of the land
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter extent of the land"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "extent", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Korale</label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter Korale name"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "korale", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Third Row - Pattu and GN Division */}
            <div className="flex items-center justify-between">
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Pattu</label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter pattu name"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "pattu", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  GN Division
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter GN Division"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "gnDivision", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Fourth Row - DS Division */}
            <div className="flex items-center justify-between">
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                  DS Division
                </label>
                <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                  <input
                    type="text"
                    placeholder="Enter DS Division"
                    className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                    onChange={(e) => handleInputChange("property", "dsDivision", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] h-[22px]"></div>
            </div>
          </div>

          {/* Registers Required for Search Section */}
          <div className="absolute left-4 sm:left-6 lg:left-[30px] top-[1060px] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[1219px]">
            <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
              Registers required for search
            </label>

            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 lg:mt-auto">
              {registerEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-[26px] items-start sm:items-end"
                >
                  {/* Division Field */}
                  <div className="w-full sm:w-[calc(33.333%-0.5rem)] md:w-[calc(30%-0.5rem)] lg:w-[274px] flex flex-col gap-[6px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-normal font-inter">
                      Division
                    </label>
                    <div className="h-10 sm:h-9 lg:h-[35px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="text"
                        placeholder="Enter division"
                        value={entry.division}
                        onChange={(e) => handleRegisterInputChange(entry.id, "division", e.target.value)}
                        className="w-full h-full px-3 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-sm sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      />
                    </div>
                  </div>

                  {/* Vol.No Field */}
                  <div className="w-full sm:w-[calc(33.333%-0.5rem)] md:w-[calc(30%-0.5rem)] lg:w-[274px] flex flex-col gap-[6px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-normal font-inter">
                      Vol.No
                    </label>
                    <div className="h-10 sm:h-9 lg:h-[35px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="text"
                        placeholder="Enter volume number"
                        value={entry.volumeNo}
                        onChange={(e) => handleRegisterInputChange(entry.id, "volumeNo", e.target.value)}
                        className="w-full h-full px-3 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-sm sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      />
                    </div>
                  </div>

                  {/* Folio No Field */}
                  <div className="w-full sm:w-[calc(33.333%-0.5rem)] md:w-[calc(30%-0.5rem)] lg:w-[274px] flex flex-col gap-[6px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-normal font-inter">
                      Folio No
                    </label>
                    <div className="h-10 sm:h-9 lg:h-[35px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="text"
                        placeholder="Enter folio number"
                        value={entry.folioNo}
                        onChange={(e) => handleRegisterInputChange(entry.id, "folioNo", e.target.value)}
                        className="w-full h-full px-3 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-sm sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto mt-2 sm:mt-0">
                    {/* Add More Button - only show on last entry and if less than 8 entries */}
                    {index === registerEntries.length - 1 && registerEntries.length < 8 && (
                      <button
                        onClick={addRegisterEntry}
                        className="w-full sm:w-auto sm:min-w-[100px] md:min-w-[118px] h-10 sm:h-9 lg:h-[34px] bg-[#002E51] rounded-[5px] border border-[#002E51] flex items-center justify-center cursor-pointer hover:bg-[#001a2e] transition-colors px-3 sm:px-4"
                      >
                        <span className="text-white text-sm sm:text-xs lg:text-[12px] font-normal font-inter">
                          Add More
                        </span>
                        <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] ml-2 flex items-center justify-center relative">
                          <div className="w-[1px] h-3 sm:h-[14px] bg-white"></div>
                          <div className="w-3 sm:w-[14px] h-[1px] bg-white absolute"></div>
                        </div>
                      </button>
                    )}

                    {/* Remove Button - only show if more than 1 entry */}
                    {registerEntries.length > 1 && (
                      <button
                        onClick={() => removeRegisterEntry(entry.id)}
                        className="w-full sm:w-10 lg:w-[34px] h-10 sm:h-9 lg:h-[34px] bg-red-500 rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                        title="Remove this register entry"
                      >
                        <span className="text-white text-lg font-bold">×</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Entry Counter */}
              <div className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-2 text-center sm:text-left">
                {registerEntries.length} of 8 register entries
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div
            className={`absolute left-4 sm:left-6 lg:left-[30px] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[1206px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 my-auto`}
            style={{ top: `${1300 + (registerEntries.length - 1) * 100}px` }}
          >
            <button
              className="w-full sm:w-auto sm:min-w-[73px] h-11 sm:h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors px-4"
              onClick={handleBack}
            >
              <span className="text-black text-sm sm:text-xs lg:text-[16px] font-medium leading-[19.2px] font-inter">
                Back
              </span>
            </button>

            {/* Navigation error */}
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
