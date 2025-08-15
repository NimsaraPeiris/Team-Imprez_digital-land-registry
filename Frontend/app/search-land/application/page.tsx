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
    address: string
    email: string
    phone: string
    nic: string
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
    address: string
    email: string
    phone: string
    nic: string
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
      address: "",
      email: "",
      phone: "",
      nic: "",
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
      address: "",
      email: "",
      phone: "",
      nic: "",
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
        address: sectionData.address ? "" : "Address is required",
        email: validateEmail(sectionData.email),
        phone: validatePhoneNumber(sectionData.phone),
        nic: validateNIC(sectionData.nic),
        date: sectionData.date ? "" : "Date is required",
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
    // Validate seller information
    const sellerData = formData.seller;
    const sellerErrors = {
      fullName: validateFullName(sellerData.fullName),
      email: validateEmail(sellerData.email),
      phone: validatePhoneNumber(sellerData.phone),
      nic: validateNIC(sellerData.nic),
      address: "",  // Removed address requirement
      date: "",     // Removed date requirement
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
      division: "",
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

    // All validations passed, navigate directly to payment page
    router.push("/search-land/payment");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/search-land/application")
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

<<<<<<< HEAD
=======
  // Function to render file upload component
  const renderFileUpload = (
    title: string,
    fileType: keyof typeof fileUploads,
    acceptedTypes: string,
    dropzoneProps: any,
    inputProps: any,
    isDragActive: boolean
  ) => (
    <div className="flex flex-col gap-[7px]">
      <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">{title}</label>
      <div
        {...dropzoneProps}
        className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] relative overflow-hidden border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] flex items-center justify-center cursor-pointer ${
          isDragActive ? "bg-blue-50 ring-2 ring-[#00508E]" : ""
        }`}
      >
        <input {...inputProps} />
        {fileUploads[fileType] ? (
          <div className="relative w-full h-full">
            <div className="w-full h-full flex items-center justify-center p-2">
              <div className="text-center">
                <div className="text-[#636363] text-[14px] font-medium mb-1">
                  ✓ {fileUploads[fileType]?.name}
                </div>
                <div className="text-[#888] text-[12px]">File uploaded successfully</div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFileUploads(prev => ({ ...prev, [fileType]: null }))
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-center px-0 my-9">
            <div className="text-[#636363] text-[14px] font-medium mb-1 py-0">
              {isDragActive ? `Drop ${title.toLowerCase()} here` : `Click to add ${title.toLowerCase()} or drag here`}
            </div>
            <div className="text-[#888] text-[12px] my-0">{acceptedTypes}</div>
          </div>
        )}
      </div>
    </div>
  )


>>>>>>> 2240116d910eb676f43684fe74df6b89a64c9b72
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
        <div className="w-full max-w-[1300px] mx-auto border-[0.3px] border-[#00508E] rounded-[5px] bg-white p-8 flex flex-col gap-8">
          {/* Applicant Information Header */}
          <div>
            <h2 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
              {currentStep === 1 ? "Applicant Information" : currentStep === 2 ? "Document Upload" : "Document Verification"}
            </h2>
            <p className="text-black text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed lg:leading-[18px] font-inter mt-2">
              {currentStep === 1 
                ? "Please fill in all required information" 
                : currentStep === 2 
                ? "Please upload all required documents for verification"
                : "Please wait while we verify your documents"
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-[248px] flex items-center justify-between">
            <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-[31px] lg:h-[31px] ${currentStep >= 1 ? 'bg-[#36BF29] border-[#36BF29]' : 'bg-[#F4F4F4] border-[#737373]'} rounded-full border flex items-center justify-center`}>
              <span className={`${currentStep >= 1 ? 'text-white' : 'text-[#807E7E]'} text-xs sm:text-sm lg:text-[15px] font-normal leading-[18px] font-inter`}>
                1
              </span>
            </div>
            <div className="w-8 sm:w-10 lg:w-[51px] h-0 border-t border-[#737373]"></div>
            <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-[31px] lg:h-[31px] ${currentStep >= 2 ? 'bg-[#36BF29] border-[#36BF29]' : 'bg-[#F4F4F4] border-[#737373]'} rounded-full border flex items-center justify-center`}>
              <span className={`${currentStep >= 2 ? 'text-white' : 'text-[#807E7E]'} text-xs sm:text-sm lg:text-[15px] font-normal leading-[18px] font-inter`}>
                2
              </span>
            </div>
            <div className="w-8 sm:w-10 lg:w-[51px] h-0 border-t border-[#807E7E]"></div>
            <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-[31px] lg:h-[31px] ${currentStep >= 3 ? 'bg-[#36BF29] border-[#36BF29]' : 'bg-[#F4F4F4] border-[#807E7E]'} rounded-full border flex items-center justify-center`}>
              <span className={`${currentStep >= 3 ? 'text-white' : 'text-[#807E7E]'} text-xs sm:text-sm lg:text-[15px] font-normal leading-[18px] font-inter`}>
                3
              </span>
            </div>
          </div>

          {/* Step 1: Form Content */}
          {currentStep === 1 && (
            <>
              {/* Applicant Details Section */}
              <div className="flex flex-col gap-[13px]">
                <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
                  Applicant Details
                </h3>

<<<<<<< HEAD
            {/* Form rows */}
            <div className="space-y-4">
              {/* Full Name and Address */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    Full Name
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter applicant's full name"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.seller.fullName}
                      onChange={(e) => handleInputChange("seller", "fullName", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.seller.fullName}</p>
                </div>
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">Address</label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter Applicants Address"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.seller.address}
                      onChange={(e) => handleInputChange("seller", "address", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.seller.address}</p>
                </div>
              </div>

              {/* Email and Phone */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    Email
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="email"
                      placeholder="Enter applicant's email"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.seller.email}
                      onChange={(e) => handleInputChange("seller", "email", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.seller.email}</p>
                </div>
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">Phone</label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="tel"
                      placeholder="Enter applicant's phone number"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.seller.phone}
                      onChange={(e) => handleInputChange("seller", "phone", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.seller.phone}</p>
                </div>
              </div>

              {/* NIC and Date */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    National Identity Card Number
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter applicant's National Identity Card Number"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.seller.nic}
                      onChange={(e) => handleInputChange("seller", "nic", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.seller.nic}</p>
                </div>
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">Date</label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="date"
                      placeholder="Enter Date"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.seller.date}
                      onChange={(e) => handleInputChange("seller", "date", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.seller.date}</p>
                </div>
              </div>

              {/* Signature Field */}
              <div className="flex flex-col gap-[7px]">
                <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Signature</label>
                <div
                  {...getRootPropsSignature()}
                  className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] relative overflow-hidden border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] flex items-center justify-center cursor-pointer ${isDragActiveSignature ? "bg-blue-50 ring-2 ring-[#00508E]" : ""
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
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors px-3 sm:px-4"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-center px-0 my-9">
                      <div className="text-[#636363] text-[14px] font-medium mb-1 py-0">
                        {isDragActiveSignature ? "Drop signature image here" : "Click to add signature or drag here"}
                      </div>
                      <div className="text-[#888] text-[12px] my-0">Upload image file (JPG, PNG, GIF)</div>
                    </div>
                  )}
                </div>
=======
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
                        value={formData.seller.fullName}
                        onChange={(e) => handleInputChange("seller", "fullName", e.target.value)}
                      />
                    </div>
                    {errors.seller.fullName && <p className="text-red-500 text-xs mt-1">{errors.seller.fullName}</p>}
                  </div>
                  <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Address</label>
                    <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="text"
                        placeholder="Enter Applicants Address"
                        className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                        value={formData.seller.address}
                        onChange={(e) => handleInputChange("seller", "address", e.target.value)}
                      />
                    </div>
                    {errors.seller.address && <p className="text-red-500 text-xs mt-1">{errors.seller.address}</p>}
                  </div>
                </div>

                {/* Second Row - Email and Phone */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-[56px] pb-4">
                  <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">
                      Email
                    </label>
                    <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="email"
                        placeholder="Enter applicant's email"
                        className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                        value={formData.seller.email}
                        onChange={(e) => handleInputChange("seller", "email", e.target.value)}
                      />
                    </div>
                    {errors.seller.email && <p className="text-red-500 text-xs mt-1">{errors.seller.email}</p>}
                  </div>
                  <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Phone</label>
                    <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="tel"
                        placeholder="Enter applicant's phone number"
                        className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                        value={formData.seller.phone}
                        onChange={(e) => handleInputChange("seller", "phone", e.target.value)}
                      />
                    </div>
                    {errors.seller.phone && <p className="text-red-500 text-xs mt-1">{errors.seller.phone}</p>}
                  </div>
                </div>

                {/* Third Row - NIC and Date */}
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
                        value={formData.seller.nic}
                        onChange={(e) => handleInputChange("seller", "nic", e.target.value)}
                      />
                    </div>
                    {errors.seller.nic && <p className="text-red-500 text-xs mt-1">{errors.seller.nic}</p>}
                  </div>
                  <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Date</label>
                    <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="date"
                        placeholder="Enter Date"
                        className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                        value={formData.seller.date}
                        onChange={(e) => handleInputChange("seller", "date", e.target.value)}
                      />
                    </div>
                    {errors.seller.date && <p className="text-red-500 text-xs mt-1">{errors.seller.date}</p>}
                  </div>
                </div>

                {/* Signature Field */}
                <div className="flex flex-col gap-[7px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Signature</label>
                  <div
                    {...getRootPropsSignature()}
                    className={`w-full h-[119px] bg-[#E9E9E9] rounded-[6px] relative overflow-hidden border-none focus:outline-none focus:ring-2 focus:ring-[#00508E] flex items-center justify-center cursor-pointer ${isDragActiveSignature ? "bg-blue-50 ring-2 ring-[#00508E]" : ""
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
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors px-3 sm:px-4"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-center px-0 my-9">
                        <div className="text-[#636363] text-[14px] font-medium mb-1 py-0">
                          {isDragActiveSignature ? "Drop signature image here" : "Click to add signature or drag here"}
                        </div>
                        <div className="text-[#888] text-[12px] my-0">Upload image file (JPG, PNG, GIF)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Blue Divider Line */}
              <div className="w-full h-0 border-t border-[#00508E]"></div>

              {/* Property Details Section */}
              <div className="flex flex-col gap-[13px]">
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
                        value={formData.property.village}
                        onChange={(e) => handleInputChange("property", "village", e.target.value)}
                      />
                    </div>
                    {errors.property.village && <p className="text-red-500 text-xs mt-1">{errors.property.village}</p>}
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
                        value={formData.property.nameOfLand}
                        onChange={(e) => handleInputChange("property", "nameOfLand", e.target.value)}
                      />
                    </div>
                    {errors.property.nameOfLand && <p className="text-red-500 text-xs mt-1">{errors.property.nameOfLand}</p>}
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
                        value={formData.property.extent}
                        onChange={(e) => handleInputChange("property", "extent", e.target.value)}
                      />
                    </div>
                    {errors.property.extent && <p className="text-red-500 text-xs mt-1">{errors.property.extent}</p>}
                  </div>
                  <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] flex flex-col gap-[7px]">
                    <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter">Korale</label>
                    <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                      <input
                        type="text"
                        placeholder="Enter Korale name"
                        className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                        value={formData.property.korale}
                        onChange={(e) => handleInputChange("property", "korale", e.target.value)}
                      />
                    </div>
                    {errors.property.korale && <p className="text-red-500 text-xs mt-1">{errors.property.korale}</p>}
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
                        value={formData.property.pattu}
                        onChange={(e) => handleInputChange("property", "pattu", e.target.value)}
                      />
                    </div>
                    {errors.property.pattu && <p className="text-red-500 text-xs mt-1">{errors.property.pattu}</p>}
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
                        value={formData.property.gnDivision}
                        onChange={(e) => handleInputChange("property", "gnDivision", e.target.value)}
                      />
                    </div>
                    {errors.property.gnDivision && <p className="text-red-500 text-xs mt-1">{errors.property.gnDivision}</p>}
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
                        value={formData.property.dsDivision}
                        onChange={(e) => handleInputChange("property", "dsDivision", e.target.value)}
                      />
                    </div>
                    {errors.property.dsDivision && <p className="text-red-500 text-xs mt-1">{errors.property.dsDivision}</p>}
                  </div>
                  <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px] h-[22px]"></div>
                </div>
              </div>

              {/* Registers Required for Search Section */}
              <div>
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
            </>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-8">
              <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
                Required Documents
              </h3>

              {/* Document Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileUpload(
                  "Original Deed",
                  "originalDeed",
                  "Upload PDF file",
                  getRootPropsOriginalDeed(),
                  getInputPropsOriginalDeed(),
                  isDragActiveOriginalDeed
                )}

                {renderFileUpload(
                  "Purchaser NIC",
                  "purchaserNIC", 
                  "Upload PDF file",
                  getRootPropsPurchaserNIC(),
                  getInputPropsPurchaserNIC(),
                  isDragActivePurchaserNIC
                )}

                {renderFileUpload(
                  "Purchaser Photo",
                  "purchaserPhoto",
                  "Upload PDF file",
                  getRootPropsPurchaserPhoto(),
                  getInputPropsPurchaserPhoto(),
                  isDragActivePurchaserPhoto
                )}

                {renderFileUpload(
                  "Vendor Photo", 
                  "vendorPhoto",
                  "Upload PDF file",
                  getRootPropsVendorPhoto(),
                  getInputPropsVendorPhoto(),
                  isDragActiveVendorPhoto
                )}

                {renderFileUpload(
                  "Guarantor 1 NIC",
                  "guarantor1NIC",
                  "Upload PDF file", 
                  getRootPropsGuarantor1NIC(),
                  getInputPropsGuarantor1NIC(),
                  isDragActiveGuarantor1NIC
                )}

                {renderFileUpload(
                  "Guarantor 2 NIC",
                  "guarantor2NIC",
                  "Upload PDF file",
                  getRootPropsGuarantor2NIC(),
                  getInputPropsGuarantor2NIC(),
                  isDragActiveGuarantor2NIC
                )}
>>>>>>> 2240116d910eb676f43684fe74df6b89a64c9b72
              </div>

<<<<<<< HEAD

          {/* Blue Divider Line */}
          <div className="w-full h-0 border-t border-[#00508E]"></div>

          {/* Property Details Section */}
          <div className="flex flex-col gap-[13px]">
            <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
              Property Details
            </h3>

            {/* Form Rows */}
            <div className="space-y-4">
              {/* Village and Name of Land */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    Village <span className="font-light">(where the land is located)</span>
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter village name"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.village}
                      onChange={(e) => handleInputChange("property", "village", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.village}</p>
                </div>
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    Name of the Land
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter Land name"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.nameOfLand}
                      onChange={(e) => handleInputChange("property", "nameOfLand", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.nameOfLand}</p>
                </div>
              </div>

              {/* Extent and Korale */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    Extent of the land
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter extent of the land"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.extent}
                      onChange={(e) => handleInputChange("property", "extent", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.extent}</p>
                </div>
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">Korale</label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter Korale name"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.korale}
                      onChange={(e) => handleInputChange("property", "korale", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.korale}</p>
                </div>
              </div>

              {/* Pattu and GN Division */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">Pattu</label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter pattu name"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.pattu}
                      onChange={(e) => handleInputChange("property", "pattu", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.pattu}</p>
                </div>
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    GN Division
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter GN Division"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.gnDivision}
                      onChange={(e) => handleInputChange("property", "gnDivision", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.gnDivision}</p>
                </div>
              </div>

              {/* DS Division */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 lg:gap-[56px]">
                <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[581px]">
                  <label className="text-black text-xs sm:text-sm lg:text-[13px] font-semibold font-inter mb-[7px] block">
                    DS Division
                  </label>
                  <div className="h-8 sm:h-9 lg:h-[39px] bg-[#E9E9E9] rounded-[6px] relative">
                    <input
                      type="text"
                      placeholder="Enter DS Division"
                      className="w-full h-full px-2 sm:px-3 lg:px-[10px] bg-transparent text-[#636363] text-xs sm:text-sm lg:text-[12px] font-inter border-none outline-none"
                      value={formData.property.dsDivision}
                      onChange={(e) => handleInputChange("property", "dsDivision", e.target.value)}
                    />
                  </div>
                  <p className="text-red-500 text-xs mt-1 h-4">{errors.property.dsDivision}</p>
                </div>
              </div>
            </div>
          </div>


          {/* Registers Required for Search Section */}
          <div>
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
=======
              {/* Upload Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Upload Progress:</div>
                <div className="space-y-1">
                  {Object.entries(fileUploads).map(([key, file]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={file ? "text-green-600" : "text-gray-400"}>
                        {file ? "✓ Uploaded" : "Pending"}
                      </span>
>>>>>>> 2240116d910eb676f43684fe74df6b89a64c9b72
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-8">
              <h3 className="text-black text-lg sm:text-xl lg:text-[20px] font-extrabold leading-tight lg:leading-[24px] font-inter">
                Document Verification
              </h3>

              <div className="space-y-6">
                {["originalDeed", "purchaserNIC", "purchaserPhoto", "vendorPhoto"].map((doc, index) => (
                  <div key={doc} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {verificationStatus[doc] === "checking" ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      ) : verificationStatus[doc] === "verified" ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium capitalize">{doc.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-sm text-gray-500">
                        {verificationStatus[doc] === "checking" ? "Verifying document..." : 
                         verificationStatus[doc] === "verified" ? "Document verified successfully" : 
                         "Waiting for verification"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-green-800 font-medium">All documents verified successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-2">
                    You can now proceed to the payment section to complete your application.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
            <button
              className="w-full sm:w-auto sm:min-w-[73px] h-11 sm:h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors px-4"
              onClick={handleBack}
            >
              <span className="text-[#002E51] text-base font-semibold font-inter">Back</span>
            </button>
<<<<<<< HEAD

            {/* Navigation error */}
=======
>>>>>>> 2240116d910eb676f43684fe74df6b89a64c9b72
            <button
              className={`w-full sm:w-auto sm:min-w-[120px] h-11 sm:h-[44px] bg-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-[#001a2e] transition-colors px-4 ${
              (currentStep === 3 && !hasVerified) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleContinue}
              disabled={currentStep === 3 && !hasVerified}
            >
              <span className="text-white text-base font-semibold font-inter">
              {currentStep === 3 ? "Proceed to Payment" : "Continue"}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
