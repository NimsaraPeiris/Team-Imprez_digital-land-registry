"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import GovernmentHeader from "@/components/government-header"
import DashboardNavigationBar from "@/components/dashboard-navigation-bar"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { Check } from "lucide-react"

export default function CopyPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())

  const documents = [
    {
      id: "copy-request-form",
      title: "Copy Request Form",
      description: "Completed and signed copy request form",
      format: "PDF, Original Scan",
    },
    {
      id: "applicant-id",
      title: "Applicant's Photo ID",
      description: "Government-issued photo identification",
      format: "PDF, Original Scan",
    },
  ]

  const toggleDocumentSelection = (documentId: string) => {
    const newSelected = new Set(selectedDocuments)
    if (newSelected.has(documentId)) {
      newSelected.delete(documentId)
    } else {
      newSelected.add(documentId)
    }
    setSelectedDocuments(newSelected)
  }

  const allDocumentsSelected = documents.length === selectedDocuments.size

  const handleBackToService = () => {
    router.push("/dashboard")
  }

  const handleStartApplication = () => {
    if (allDocumentsSelected) {
      router.push("/copy/application")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header and navigation */}
      <div className="sticky top-0 z-50">
        <GovernmentHeader />
        <DashboardNavigationBar />
      </div>

      <main className="py-8 px-[75px]">
        {/* Header Section */}
        <div className="w-[1291px] h-[151px] bg-[#102A3D] rounded-[9px] mb-[20px] relative">
          <div className="absolute left-[23px] top-[43px] flex flex-col gap-[5px]">
            <h1 className="text-white text-[35px] font-bold leading-[42px] font-inter">Application for Copy</h1>
            <p className="text-white text-[16px] font-light leading-[19.2px] font-inter">
              Request a duplicate copy of a registered deed
            </p>
          </div>
        </div>

        {/* Tutorial Video Section */}
        <div className="w-[1284px] h-[374px] rounded-[24px] border border-[#DAD7D7] mb-[20px] relative overflow-hidden">
          <div className="absolute left-[44px] top-[35px] w-[646px] h-[304px] bg-[#8C8C8C] rounded-[8px] relative overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Copy Application Tutorial"
              className="w-full h-full rounded-[8px]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="absolute left-[731px] top-[140px]">
            <h2 className="text-black text-[23px] font-semibold leading-[27.6px] font-inter mb-[77px]">
              How to
              <br />
              Complete Your Copy Application
            </h2>
            <p className="text-[#626262] text-[16px] font-normal leading-[19.2px] font-inter">
              Watch this tutorial to understand the complete process (8:45)
            </p>
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="w-[1284px] rounded-[36px] border border-[#DAD7D7] mb-[20px] relative overflow-hidden">
          <div className="p-[36px]">
            <div className="mb-[65px]">
              <div className="mb-[34px]">
                <h2 className="text-black text-[24px] font-bold leading-[28.8px] font-inter mb-[13px]">
                  Required Documents
                </h2>
                <p className="text-[#747474] text-[24px] font-normal leading-[28.8px] font-inter">
                  Gather these documents before starting your application
                </p>
              </div>

              <div className="space-y-[26px]">
                {documents.map((document) => {
                  const isSelected = selectedDocuments.has(document.id)
                  return (
                    <div
                      key={document.id}
                      onClick={() => toggleDocumentSelection(document.id)}
                      className={`h-[147px] rounded-[9px] border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                        isSelected ? "border-[#4490CC] bg-blue-50" : "border-[#DAD7D7] hover:border-[#4490CC]/50"
                      }`}
                    >
                      <div className="absolute left-[22px] top-[32px] w-[360px] flex flex-col gap-[10px]">
                        <h3 className="text-black text-[24px] font-bold leading-[28.8px] font-inter">
                          {document.title}
                        </h3>
                        <p className="text-[#7D7D7D] text-[15px] font-normal leading-[18px] font-inter">
                          {document.description}
                        </p>
                        <div className="flex items-center">
                          <span className="text-[#E36060] text-[13px] font-bold leading-[15.6px] font-inter">
                            Format:{" "}
                          </span>
                          <span className="text-[#E36060] text-[13px] font-normal leading-[15.6px] font-inter">
                            {document.format}
                          </span>
                        </div>
                      </div>

                      <div className="absolute right-[22px] top-[50px]">
                        <button
                          className={`w-[100px] h-[40px] rounded-[8px] border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                            isSelected
                              ? "bg-[#4490CC] border-[#4490CC] text-white"
                              : "bg-white border-[#DAD7D7] text-gray-600 hover:border-[#4490CC] hover:text-[#4490CC]"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={16} className="text-white" />
                              <span className="text-[12px] font-medium">Selected</span>
                            </>
                          ) : (
                            <span className="text-[12px] font-medium">Select</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-[10px]">
              <button
                onClick={handleStartApplication}
                disabled={!allDocumentsSelected}
                className={`w-[350px] h-[62px] rounded-[10px] flex items-center justify-center transition-all duration-200 ${
                  allDocumentsSelected
                    ? "bg-[#4490CC] hover:bg-[#3a7bb8] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <span
                  className={`text-[24px] font-semibold leading-[28.8px] font-inter ${
                    allDocumentsSelected ? "text-white" : "text-gray-500"
                  }`}
                >
                  Start Application {allDocumentsSelected ? "" : `(${selectedDocuments.size}/${documents.length})`}
                </span>
              </button>
              <button
                onClick={handleBackToService}
                className="w-[350px] h-[62px] bg-white border border-[#00508E] rounded-[10px] flex items-center justify-center hover:bg-blue-50 transition-colors"
              >
                <span className="text-[#00508E] text-[24px] font-normal leading-[28.8px] font-inter">
                  Back to Service
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="w-[819px] mb-[20px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[5px]">
              <h3 className="text-black text-[20px] font-medium font-inter">Need Help ?</h3>
              <p className="text-[#767676] text-[20px] font-medium font-inter">
                Our support team is available to assist with your land registry applications.
              </p>
            </div>
            <div className="flex items-center gap-[17px]">
              <button className="w-[150px] h-[42px] border border-black rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="text-black text-[16px] font-medium font-inter">Contact Support</span>
              </button>
              <button className="w-[83px] h-[42px] border border-black rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="text-black text-[16px] font-medium font-inter">FAQ</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <ContactSection />
      <Footer />
    </div>
  )
}
