export default function FAQSection() {
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
                <div className="flex items-center gap-6">
                  <div className="w-0.5 h-4 bg-purple-500 flex-shrink-0"></div>
                  <h3 className="text-gray-600 font-normal capitalize">{faq.question}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
