"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import Footer from "@/components/footer"
import { Download, Mail, Printer, CheckCircle } from "lucide-react"

export default function QRConfirmationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    router.push("/search-duplicate-deeds/payment")
  }

  const handleGoToHome = () => {
    router.push("/dashboard")
  }

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log("Downloading PDF...")
  }

  const handleSendEmail = () => {
    // Implement email sending functionality
    console.log("Sending email...")
  }

  const handlePrint = () => {
    window.print()
  }

  const confirmationData = {
    reference: "LT-2024-001234",
    transactionId: "TXN-789456123",
    buyer: user?.name || "John Doe",
    seller: "Jane Smith",
    property: "Plot 123, Galle Road, Colombo 03",
    totalFees: "Rs.200.00",
    paymentMethod: "Credit Card",
    paymentDate: new Date().toLocaleDateString("en-GB"),
    paymentTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-50">
          <GovernmentHeader />
          <DashboardNavigationBar />
        </div>

        <main className="py-8 px-[75px]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#4490CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-[24px] font-bold text-black mb-2">Processing Payment...</h2>
              <p className="text-[16px] text-gray-600">Please wait while we confirm your payment</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      <main className="py-8 px-[75px]">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-green-800 text-[18px] font-bold">Payment Successful!</h3>
              <p className="text-green-700 text-[14px]">
                Your search Duplicate of Deeds application has been submitted successfully.
              </p>
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-black text-[32px] font-bold leading-[48px] text-left">Payment Confirmation</h1>
          <p className="text-gray-600 text-[16px] mt-2">Your QR confirmation code and transaction details</p>
        </div>

        {/* Main Confirmation Container */}
        <div className="w-full max-w-[1300px] mx-auto bg-white border border-[#E0E0E0] rounded-[12px] shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#102A3D] px-8 py-6">
            <h2 className="text-white text-[24px] font-bold">Application for search Duplicate of Deeds Confirmation</h2>
            <p className="text-blue-100 text-[14px] mt-1">Reference: {confirmationData.reference}</p>
          </div>

          {/* QR Code and Details Section */}
          <div className="p-8">
            <div className="flex gap-12 items-start">
              {/* QR Code Section */}
              <div className="flex-shrink-0">
                <div className="w-[200px] h-[200px] bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-md">
                  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* QR Code pattern */}
                    <rect width="180" height="180" fill="white" />

                    {/* Corner squares */}
                    <rect x="0" y="0" width="30" height="30" fill="black" />
                    <rect x="4" y="4" width="22" height="22" fill="white" />
                    <rect x="8" y="8" width="14" height="14" fill="black" />

                    <rect x="150" y="0" width="30" height="30" fill="black" />
                    <rect x="154" y="4" width="22" height="22" fill="white" />
                    <rect x="158" y="8" width="14" height="14" fill="black" />

                    <rect x="0" y="150" width="30" height="30" fill="black" />
                    <rect x="4" y="154" width="22" height="22" fill="white" />
                    <rect x="8" y="158" width="14" height="14" fill="black" />

                    {/* Center alignment square */}
                    <rect x="75" y="75" width="30" height="30" fill="black" />
                    <rect x="79" y="79" width="22" height="22" fill="white" />
                    <rect x="83" y="83" width="14" height="14" fill="black" />

                    {/* Data patterns */}
                    <rect x="40" y="8" width="6" height="6" fill="black" />
                    <rect x="50" y="8" width="6" height="6" fill="black" />
                    <rect x="64" y="8" width="6" height="6" fill="black" />
                    <rect x="74" y="8" width="6" height="6" fill="black" />
                    <rect x="110" y="8" width="6" height="6" fill="black" />
                    <rect x="124" y="8" width="6" height="6" fill="black" />
                    <rect x="134" y="8" width="6" height="6" fill="black" />

                    <rect x="8" y="40" width="6" height="6" fill="black" />
                    <rect x="40" y="40" width="6" height="6" fill="black" />
                    <rect x="50" y="40" width="6" height="6" fill="black" />
                    <rect x="110" y="40" width="6" height="6" fill="black" />
                    <rect x="124" y="40" width="6" height="6" fill="black" />
                    <rect x="158" y="40" width="6" height="6" fill="black" />
                    <rect x="172" y="40" width="6" height="6" fill="black" />

                    <rect x="40" y="50" width="6" height="6" fill="black" />
                    <rect x="64" y="50" width="6" height="6" fill="black" />
                    <rect x="110" y="50" width="6" height="6" fill="black" />
                    <rect x="134" y="50" width="6" height="6" fill="black" />
                    <rect x="158" y="50" width="6" height="6" fill="black" />

                    <rect x="8" y="110" width="6" height="6" fill="black" />
                    <rect x="40" y="110" width="6" height="6" fill="black" />
                    <rect x="64" y="110" width="6" height="6" fill="black" />
                    <rect x="110" y="110" width="6" height="6" fill="black" />
                    <rect x="124" y="110" width="6" height="6" fill="black" />
                    <rect x="158" y="110" width="6" height="6" fill="black" />

                    <rect x="40" y="124" width="6" height="6" fill="black" />
                    <rect x="50" y="124" width="6" height="6" fill="black" />
                    <rect x="74" y="124" width="6" height="6" fill="black" />
                    <rect x="110" y="124" width="6" height="6" fill="black" />
                    <rect x="134" y="124" width="6" height="6" fill="black" />
                    <rect x="158" y="124" width="6" height="6" fill="black" />
                    <rect x="172" y="124" width="6" height="6" fill="black" />

                    <rect x="40" y="158" width="6" height="6" fill="black" />
                    <rect x="64" y="158" width="6" height="6" fill="black" />
                    <rect x="74" y="158" width="6" height="6" fill="black" />
                    <rect x="110" y="158" width="6" height="6" fill="black" />
                    <rect x="124" y="158" width="6" height="6" fill="black" />
                    <rect x="158" y="158" width="6" height="6" fill="black" />
                    <rect x="172" y="158" width="6" height="6" fill="black" />
                  </svg>
                </div>
                <p className="text-center text-[12px] text-gray-500 mt-2">Scan to verify transaction</p>
              </div>

              {/* Transaction Details */}
              <div className="flex-1">
                <h3 className="text-[20px] font-bold text-black mb-6">Transaction Details</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Reference Number</label>
                      <p className="text-[16px] text-black font-medium">{confirmationData.reference}</p>
                    </div>

                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Transaction ID</label>
                      <p className="text-[16px] text-black font-medium">{confirmationData.transactionId}</p>
                    </div>

                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Buyer</label>
                      <p className="text-[16px] text-black font-medium">{confirmationData.buyer}</p>
                    </div>

                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Seller</label>
                      <p className="text-[16px] text-black font-medium">{confirmationData.seller}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Property</label>
                      <p className="text-[16px] text-black font-medium">{confirmationData.property}</p>
                    </div>

                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Total Amount</label>
                      <p className="text-[18px] text-green-600 font-bold">{confirmationData.totalFees}</p>
                    </div>

                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Payment Method</label>
                      <p className="text-[16px] text-black font-medium">{confirmationData.paymentMethod}</p>
                    </div>

                    <div>
                      <label className="text-[14px] font-semibold text-gray-700">Payment Date & Time</label>
                      <p className="text-[16px] text-black font-medium">
                        {confirmationData.paymentDate} at {confirmationData.paymentTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-[14px] font-medium">Download PDF</span>
                  </button>

                  <button
                    onClick={handleSendEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-[14px] font-medium">Email Receipt</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-[14px] font-medium">Print</span>
                  </button>
                </div>

                <div className="flex gap-4">
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
                    <span className="text-white text-[16px] font-medium leading-[19.2px]">Go to Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-yellow-800 text-[16px] font-bold mb-2">Important Notice</h4>
          <ul className="text-yellow-700 text-[14px] space-y-1">
            <li>• Please save this confirmation for your records</li>
            <li>• Your application will be processed within 5-7 business days</li>
            <li>• You will receive email updates on the application status</li>
            <li>• Contact support if you have any questions: 1919</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}
