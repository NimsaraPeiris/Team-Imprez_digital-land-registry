"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import Footer from "@/components/footer"

interface PaymentFormData {
  firstName: string
  lastName: string
  city: string
  province: string
  zipCode: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export default function LandTransferPaymentPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState<PaymentFormData>({
    firstName: "",
    lastName: "",
    city: "",
    province: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBack = () => {
    router.push("/search-land/application")
  }

  const handlePayNow = () => {
    // Validate all required fields
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.cardNumber,
      formData.expiryDate,
      formData.cvv,
    ]

    const hasEmptyFields = requiredFields.some((field) => !field.trim())

    if (hasEmptyFields) {
      alert("Please fill in all required payment details before continuing.")
      return
    }

    // Basic validation for card number (should be 16 digits)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, "")
    if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      alert("Please enter a valid 16-digit card number.")
      return
    }

    // Basic validation for expiry date (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      alert("Please enter expiry date in MM/YY format.")
      return
    }

    // Basic validation for CVV (3 digits)
    if (formData.cvv.length !== 3 || !/^\d+$/.test(formData.cvv)) {
      alert("Please enter a valid 3-digit CVV.")
      return
    }

    // Handle payment processing
    console.log("Processing payment...", formData)
    // Navigate to confirmation page
    router.push("/land-transfer/confirmation")
  }

  const steps = [1, 2, 3, 4, 5]
  const currentStep = 4

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
          <h1 className="text-black text-[32px] font-bold leading-[48px] text-left">Application for Search of Land Registers</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1300px] mx-auto border border-[#00508E] rounded-[5px] relative overflow-hidden">
          {/* Form Header */}
          <div className="px-8 pt-12 pb-6">
            <div className="mb-2">
              <h2 className="text-black text-[20px] font-extrabold leading-[24px]">Payment</h2>
            </div>
            <div className="mb-8">
              <p className="text-black text-[15px] font-normal leading-[18px]">
                Complete your payment to finalize the search of land registers application
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="w-[281px] flex items-center justify-between">
                <div className="w-[31px] h-[31px] bg-[#36BF29] border border-[#36BF29] rounded-full flex items-center justify-center">
                  <span className="text-white text-[15px] font-normal leading-[18px] font-inter">1</span>
                </div>
                <div className="w-[51px] h-0 border-t border-[#36BF29]"></div>
                <div className="w-[31px] h-[31px] bg-[#36BF29] border border-[#36BF29] rounded-full flex items-center justify-center">
                  <span className="text-white text-[15px] font-normal leading-[18px] font-inter">2</span>
                </div>
                <div className="w-[51px] h-0 border-t border-[#36BF29]"></div>
                <div className="w-[31px] h-[31px] bg-[#F4F4F4] border border-[#737373] rounded-full flex items-center justify-center">
                  <span className="text-[#807E7E] text-[15px] font-normal leading-[18px] font-inter">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="px-8 mb-8">
            <div className="flex gap-8">
              <div className="w-[553px] h-[450px] border border-[#868686] rounded-[6px] relative overflow-hidden">
                {/* Card Details Header */}
                <div className="w-full h-[62px] border-b border-[#888787] flex items-center px-6">
                  <h3 className="text-black text-[24px] font-bold capitalize">Payment Information</h3>
                </div>

                {/* Form Fields */}
                <div className="px-[21px] py-[20px]">
                  <div className="flex flex-col gap-[20px]">
                    {/* Card Number */}
                    <div className="flex flex-col gap-2">
                      <label className="text-black text-[14px] font-semibold">Card Number</label>
                      <div className="w-full h-[46px] bg-[#FAFAFA] border border-[#CECECE] rounded-[9px] relative">
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full h-full px-[18px] bg-transparent text-[#7C7C7C] text-[15px] font-medium border-none outline-none placeholder-[#7C7C7C]"
                        />
                      </div>
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="flex items-center gap-[18px]">
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-black text-[14px] font-semibold">Expiry Date</label>
                        <div className="w-full h-[46px] bg-[#FAFAFA] border border-[#CECECE] rounded-[9px] relative">
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            placeholder="MM/YY"
                            className="w-full h-full px-[18px] bg-transparent text-[#7C7C7C] text-[15px] font-medium border-none outline-none placeholder-[#7C7C7C]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-black text-[14px] font-semibold">CVV</label>
                        <div className="w-full h-[46px] bg-[#FAFAFA] border border-[#CECECE] rounded-[9px] relative">
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            placeholder="123"
                            className="w-full h-full px-[18px] bg-transparent text-[#7C7C7C] text-[15px] font-medium border-none outline-none placeholder-[#7C7C7C]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-black text-[14px] font-semibold">Cardholder Name</label>
                      <div className="w-full h-[46px] bg-[#FAFAFA] border border-[#CECECE] rounded-[9px] relative">
                        <input
                          type="text"
                          value={`${formData.firstName} ${formData.lastName}`}
                          onChange={(e) => {
                            const names = e.target.value.split(" ")
                            handleInputChange("firstName", names[0] || "")
                            handleInputChange("lastName", names.slice(1).join(" ") || "")
                          }}
                          placeholder="John Doe"
                          className="w-full h-full px-[18px] bg-transparent text-[#7C7C7C] text-[15px] font-medium border-none outline-none placeholder-[#7C7C7C]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accepted Cards */}
                <div className="absolute bottom-[20px] left-[21px] right-[21px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C7C7C] text-[14px] font-medium">Accepted Cards:</span>
                    <div className="flex items-center gap-[8px]">
                      {/* Visa */}
                      <div className="w-[32px] h-[20px] bg-white border border-gray-300 relative rounded-sm flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=20&width=32&text=VISA"
                          alt="Visa"
                          className="w-full h-full object-contain rounded-sm"
                        />
                      </div>
                      {/* Mastercard */}
                      <div className="w-[32px] h-[20px] bg-white border border-gray-300 relative rounded-sm flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=20&width=32&text=MC"
                          alt="Mastercard"
                          className="w-full h-full object-contain rounded-sm"
                        />
                      </div>
                      {/* American Express */}
                      <div className="w-[32px] h-[20px] bg-white border border-gray-300 relative rounded-sm flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=20&width=32&text=AMEX"
                          alt="American Express"
                          className="w-full h-full object-contain rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="w-[400px] h-[450px] border border-[#868686] rounded-[6px] relative overflow-hidden">
                {/* Payment Summary Header */}
                <div className="w-full h-[62px] border-b border-[#888787] flex items-center px-6">
                  <h3 className="text-black text-[24px] font-bold capitalize">Payment Summary</h3>
                </div>

                {/* Payment Details Content */}
                <div className="px-[21px] py-[20px]">
                  <div className="flex flex-col gap-[20px]">
                    {/* Service Details */}
                    <div className="flex flex-col gap-[12px]">
                      <h4 className="text-black text-[18px] font-semibold">Service Details</h4>
                      <div className="bg-[#F8F9FA] p-4 rounded-[8px]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#666666] text-[14px]">Service Type:</span>
                          <span className="text-black text-[14px] font-medium">Application for Search of Land Registers</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#666666] text-[14px]">Application ID:</span>
                          <span className="text-black text-[14px] font-medium">LT-2024-001234</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#666666] text-[14px]">Processing Fee:</span>
                          <span className="text-black text-[14px] font-medium">Rs.200.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="flex flex-col gap-[12px]">
                      <h4 className="text-black text-[18px] font-semibold">Fee Breakdown</h4>
                      <div className="bg-[#F8F9FA] p-4 rounded-[8px]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#666666] text-[14px]">Registration Fee:</span>
                          <span className="text-black text-[14px]">Rs.150.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#666666] text-[14px]">Processing Fee:</span>
                          <span className="text-black text-[14px]">Rs.30.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#666666] text-[14px]">Service Charge:</span>
                          <span className="text-black text-[14px]">Rs.20.00</span>
                        </div>
                        <div className="w-full h-[1px] bg-[#DDDDDD] my-3"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-black text-[16px] font-bold">Total Amount:</span>
                          <span className="text-[#2E7D32] text-[18px] font-bold">Rs.200.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex flex-col gap-[8px] mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                          </svg>
                        </div>
                        <span className="text-[#2E7D32] text-[12px] font-medium">Secure SSL Encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                          </svg>
                        </div>
                        <span className="text-[#2E7D32] text-[12px] font-medium">PCI DSS Compliant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                          </svg>
                        </div>
                        <span className="text-[#2E7D32] text-[12px] font-medium">24/7 Fraud Protection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-8 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="w-[73px] h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-black text-[16px] font-medium leading-[19.2px]">Back</span>
            </button>

            <button
              onClick={handlePayNow}
              disabled={
                !formData.firstName ||
                !formData.lastName ||
                !formData.cardNumber ||
                !formData.expiryDate ||
                !formData.cvv
              }
              className={`px-[18px] py-[7px] rounded-[8px] flex items-center gap-3 transition-colors ${
                !formData.firstName ||
                !formData.lastName ||
                !formData.cardNumber ||
                !formData.expiryDate ||
                !formData.cvv
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#002E51] hover:bg-[#001a2e]"
              }`}
            >
              <span
                className={`text-[16px] font-medium leading-[19.2px] ${
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.cardNumber ||
                  !formData.expiryDate ||
                  !formData.cvv
                    ? "text-gray-600"
                    : "text-white"
                }`}
              >
                {!formData.firstName ||
                !formData.lastName ||
                !formData.cardNumber ||
                !formData.expiryDate ||
                !formData.cvv
                  ? "Complete Payment Details"
                  : "Pay Now and Continue"}
              </span>
              <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                <img src="/right-arrow-icon.png" alt="Continue arrow" className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
      </main>

      <Footer />
    </div>
  )
}
