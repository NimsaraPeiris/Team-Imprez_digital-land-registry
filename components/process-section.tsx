import { FileText, Globe, CheckCircle, Award } from "lucide-react"

export default function ProcessSection() {
  const steps = [
    {
      number: 1,
      title: "Prepare documents",
      description: "Gather deeds, surveys, IDs, and supporting affidavits.",
      icon: FileText,
    },
    {
      number: 2,
      title: "Apply online",
      description: "Fill the application and upload digital copies of documents.",
      icon: Globe,
    },
    {
      number: 3,
      title: "Verification",
      description: "AI validate records and request clarifications if needed.",
      icon: CheckCircle,
    },
    {
      number: 4,
      title: "Issuance",
      description: "Receive your registration certificate or updated title.",
      icon: Award,
    },
  ]

  return (
    <section className="bg-[#F4FAFF] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[32px] font-bold text-black leading-[38.4px] mb-4">How it works</h2>
          <p className="text-xl text-[#464646] leading-6">
            A straightforward process to register and update land records.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-6 max-w-6xl mx-auto">
          {steps.map((step) => {
            const IconComponent = step.icon
            return (
              <div key={step.number} className="w-full lg:w-[328px] h-[109px] relative">
                {/* Step number circle */}
                <div className="w-[29px] h-[29px] bg-[#509FF9] rounded-full flex items-center justify-center absolute left-0 top-0 z-10">
                  <span className="text-white text-sm font-normal leading-[16.8px]">{step.number}</span>
                </div>

                {/* Step card */}
                <div className="w-[314px] h-[94px] ml-[14px] mt-[15px] bg-white rounded-2xl border border-[#C8C8C8] p-4 relative">
                  {/* Icon */}
                  <div className="absolute left-[24px] top-[18px]">
                    <IconComponent className="w-4 h-4 text-[#4A80BE]" />
                  </div>

                  {/* Content */}
                  <div className="ml-[29px]">
                    <h3 className="text-black text-base font-normal leading-[19.2px] mb-2">{step.title}</h3>
                    <p className="text-black text-xs font-light leading-[14.4px] w-[195px]">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
