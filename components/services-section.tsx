import { FileText, Home, Building, Copy } from "lucide-react"

const services = [
  {
    id: 1,
    title: "Land Transfer",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    icon: FileText,
  },
  {
    id: 2,
    title: "Application for Copy of Land Registers",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    icon: Copy,
  },
  {
    id: 3,
    title: "Register Property",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    icon: Building,
  },
  {
    id: 4,
    title: "Register Property",
    description: "Submit new title registration, attach surveys, and pay required fees.",
    icon: Home,
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <div className="max-w-lg">
              <h2 className="text-2xl font-semibold text-black mb-3">Services</h2>
              <p className="text-xl text-[#00508E] leading-6">
                Explore our most-requested services and get started online.
              </p>
            </div>
            <div className="text-xl text-black hover:text-[#00508E] transition-colors duration-300 cursor-pointer">
              View all Services
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Top row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service) => {
              const IconComponent = service.icon
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-blue-100 hover:border-[#00508E] hover:scale-105 transition-all duration-300 ease-in-out p-6 h-38 cursor-pointer group"
                >
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className="w-9 h-9 bg-[#002E51] group-hover:bg-[#00508E] rounded flex items-center justify-center mb-4 transition-colors duration-300">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-normal text-black group-hover:text-[#00508E] mb-2 leading-6 transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-black leading-4 flex-grow">{service.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom row - 1 card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(3, 4).map((service) => {
              const IconComponent = service.icon
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-blue-100 hover:border-[#00508E] hover:scale-105 transition-all duration-300 ease-in-out p-6 h-38 cursor-pointer group"
                >
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className="w-9 h-9 bg-[#002E51] group-hover:bg-[#00508E] rounded flex items-center justify-center mb-4 transition-colors duration-300">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-normal text-black group-hover:text-[#00508E] mb-2 leading-6 transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-black leading-4 flex-grow">{service.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
