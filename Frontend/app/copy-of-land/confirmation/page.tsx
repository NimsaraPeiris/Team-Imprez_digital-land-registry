"use client"

import React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import Footer from "@/components/footer"

export default function LandTransferConfirmationPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleBack = () => {
    router.push("/land-transfer/payment")
  }

  const handleGoToHome = () => {
    router.push("/dashboard")
  }

  const steps = [1, 2, 3, 4, 5]
  const currentStep = 5 // All steps completed

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      <main className="py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-[75px]">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-black text-[32px] font-bold leading-[48px] text-left">Land Transfer</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1300px] mx-auto border border-[#9E9E9E] rounded-[5px] relative overflow-hidden">
          {/* Form Header */}
          <div className="px-8 pt-12 pb-6">
            <div className="mb-2">
              <h2 className="text-black text-[20px] font-extrabold leading-[24px]">Confirmation</h2>
            </div>
            <div className="mb-8">
              <p className="text-black text-[15px] font-normal leading-[18px]">
                Your land transfer application has been successfully submitted
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-16 w-full max-w-[551px]">
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
                        step < currentStep ? "border-[#36BF29]" : "border-[#807E7E]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Confirmation Details */}
            <div className="h-auto min-h-[252px] border border-[#807E7E] rounded-[7px] relative overflow-hidden mb-8 p-4 sm:p-6">
              {/* QR Code */}
              <div className="w-[128px] h-[136px] mx-auto sm:absolute sm:left-[45px] sm:top-[58px] bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-6 sm:mb-0">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* QR Code pattern */}
                  <rect width="120" height="120" fill="white" />
                  {/* Corner squares */}
                  <rect x="0" y="0" width="21" height="21" fill="black" />
                  <rect x="3" y="3" width="15" height="15" fill="white" />
                  <rect x="6" y="6" width="9" height="9" fill="black" />

                  <rect x="99" y="0" width="21" height="21" fill="black" />
                  <rect x="102" y="3" width="15" height="15" fill="white" />
                  <rect x="105" y="6" width="9" height="9" fill="black" />

                  <rect x="0" y="99" width="21" height="21" fill="black" />
                  <rect x="3" y="102" width="15" height="15" fill="white" />
                  <rect x="6" y="105" width="9" height="9" fill="black" />

                  {/* Data pattern */}
                  <rect x="30" y="6" width="3" height="3" fill="black" />
                  <rect x="36" y="6" width="3" height="3" fill="black" />
                  <rect x="42" y="6" width="3" height="3" fill="black" />
                  <rect x="54" y="6" width="3" height="3" fill="black" />
                  <rect x="60" y="6" width="3" height="3" fill="black" />
                  <rect x="72" y="6" width="3" height="3" fill="black" />
                  <rect x="84" y="6" width="3" height="3" fill="black" />

                  <rect x="30" y="12" width="3" height="3" fill="black" />
                  <rect x="42" y="12" width="3" height="3" fill="black" />
                  <rect x="48" y="12" width="3" height="3" fill="black" />
                  <rect x="66" y="12" width="3" height="3" fill="black" />
                  <rect x="78" y="12" width="3" height="3" fill="black" />
                  <rect x="84" y="12" width="3" height="3" fill="black" />

                  {/* More pattern elements */}
                  <rect x="6" y="30" width="3" height="3" fill="black" />
                  <rect x="12" y="30" width="3" height="3" fill="black" />
                  <rect x="30" y="30" width="3" height="3" fill="black" />
                  <rect x="36" y="30" width="3" height="3" fill="black" />
                  <rect x="48" y="30" width="3" height="3" fill="black" />
                  <rect x="60" y="30" width="3" height="3" fill="black" />
                  <rect x="72" y="30" width="3" height="3" fill="black" />
                  <rect x="84" y="30" width="3" height="3" fill="black" />
                  <rect x="96" y="30" width="3" height="3" fill="black" />
                  <rect x="108" y="30" width="3" height="3" fill="black" />

                  {/* Center alignment square */}
                  <rect x="51" y="51" width="18" height="18" fill="black" />
                  <rect x="54" y="54" width="12" height="12" fill="white" />
                  <rect x="57" y="57" width="6" height="6" fill="black" />

                  {/* Additional data patterns */}
                  <rect x="30" y="72" width="3" height="3" fill="black" />
                  <rect x="42" y="72" width="3" height="3" fill="black" />
                  <rect x="78" y="72" width="3" height="3" fill="black" />
                  <rect x="90" y="72" width="3" height="3" fill="black" />
                  <rect x="102" y="72" width="3" height="3" fill="black" />

                  <rect x="6" y="84" width="3" height="3" fill="black" />
                  <rect x="18" y="84" width="3" height="3" fill="black" />
                  <rect x="30" y="84" width="3" height="3" fill="black" />
                  <rect x="48" y="84" width="3" height="3" fill="black" />
                  <rect x="66" y="84" width="3" height="3" fill="black" />
                  <rect x="84" y="84" width="3" height="3" fill="black" />
                  <rect x="96" y="84" width="3" height="3" fill="black" />

                  <rect x="30" y="96" width="3" height="3" fill="black" />
                  <rect x="42" y="96" width="3" height="3" fill="black" />
                  <rect x="54" y="96" width="3" height="3" fill="black" />
                  <rect x="72" y="96" width="3" height="3" fill="black" />
                  <rect x="84" y="96" width="3" height="3" fill="black" />
                  <rect x="96" y="96" width="3" height="3" fill="black" />
                  <rect x="108" y="96" width="3" height="3" fill="black" />
                </svg>
              </div>

              {/* Confirmation Details */}
              <div className="sm:absolute sm:left-[211px] sm:top-[64px] w-full sm:w-[400px] flex flex-col gap-[17px] items-stretch mx-0 my-[-19px]">
                <div className="text-black text-[16px] font-medium leading-[19.2px]">Confirmation</div>

                <div className="flex flex-col gap-[7px]">
                  <div className="flex items-center">
                    <span className="text-black text-[16px] font-bold leading-[19.2px] min-w-[80px]">Reference:</span>
                    <span className="text-[#8C8787] text-[16px] font-medium leading-[19.2px] ml-2">LF-DE7A3E</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-black text-[16px] font-bold leading-[19.2px] min-w-[80px]">Buyer:</span>
                    <span className="text-[#8C8787] text-[16px] font-medium leading-[19.2px] ml-2">
                      {user?.name || "John Doe"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-black text-[16px] font-bold leading-[19.2px] min-w-[80px]">Seller:</span>
                    <span className="text-[#8C8787] text-[16px] font-medium leading-[19.2px] ml-2">Jane Smith</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-black text-[16px] font-bold leading-[19.2px] min-w-[80px]">Property:</span>
                    <span className="text-[#8C8787] text-[16px] font-medium leading-[19.2px] ml-2">
                      Plot 123, Colombo
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-black text-[16px] font-bold leading-[19.2px] min-w-[80px]">Total Fees:</span>
                    <span className="text-[#8C8787] text-[16px] font-medium leading-[19.2px] ml-2">Rs.200.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
              <button
                onClick={handleBack}
                className="w-[73px] h-[44px] bg-white border border-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-black text-[16px] font-medium leading-[19.2px]">Back</span>
              </button>

              <button
                onClick={handleGoToHome}
                className="px-[18px] py-[13px] bg-[#002E51] rounded-[8px] flex items-center justify-center hover:bg-[#001a2e] transition-colors"
              >
                <span className="text-white text-[16px] font-medium leading-[19.2px]">Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
