"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is the purpose of this website?",
      answer: "This website provides digital services for land registration and property records management.",
    },
    {
      question: "How do I register my property online?",
      answer:
        "You can register your property by following our 4-step process: prepare documents, apply online, verification, and issuance.",
    },
    {
      question: "What documents do I need for land transfer?",
      answer:
        "You will need the original deed, identity documents, survey plans, and any relevant court orders or agreements.",
    },
    {
      question: "How long does the verification process take?",
      answer:
        "The verification process typically takes 3-5 business days depending on the complexity of your application.",
    },
  ]

  const handleClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Header */}
          <div className="space-y-4">
            <div className="inline-block bg-blue-200 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
              Help Center
            </div>
            <h2 className="text-3xl font-semibold text-black leading-tight">Frequently asked questions</h2>
            <p className="text-xl text-blue-800 leading-relaxed">
              Answers to common questions about land registration and records.
            </p>
          </div>

          {/* Right side - FAQ List */}
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`relative py-5 ${index !== faqs.length - 1 ? "border-b border-gray-300" : ""}`}
              >
                <div
                  className="flex items-center gap-6 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-sm hover:-mx-4 hover:px-4 hover:py-2 hover:rounded-lg"
                  onClick={() => handleClick(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`w-0.5 h-4 flex-shrink-0 transition-all duration-300 ${
                      expandedIndex === index
                        ? "bg-blue-600 w-1 h-6"
                        : hoveredIndex === index
                          ? "bg-purple-600 w-0.5 h-5"
                          : "bg-purple-500"
                    }`}
                  ></div>
                  <h3
                    className={`font-normal capitalize transition-colors duration-300 flex-1 ${
                      expandedIndex === index
                        ? "text-blue-700 font-medium"
                        : hoveredIndex === index
                          ? "text-gray-800"
                          : "text-gray-600"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-all duration-300 ${
                      expandedIndex === index
                        ? "rotate-180 text-blue-600"
                        : hoveredIndex === index
                          ? "text-purple-600"
                          : "text-gray-400"
                    }`}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedIndex === index ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-10 pr-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
