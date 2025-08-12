import { Phone, Mail, Calendar, MapPin } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="w-full max-w-[1370px] mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left side - Contact Information */}
          <div className="flex-1 max-w-xl">
            <div className="mb-8">
              <h2 className="text-[26px] font-semibold text-black mb-3 leading-[31.2px]">Contact us</h2>
              <p className="text-[20px] text-[#00508E] leading-6">We're here to help during regular business hours.</p>
            </div>

            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#00508E] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-[20px] font-medium text-black leading-6 mb-1">Phone Number</h3>
                  <p className="text-[20px] text-[#7E7E7E] leading-6">+0 (000) 000-000</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#00508E] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-[20px] font-medium text-black leading-6 mb-1">Email</h3>
                  <p className="text-[20px] text-[#7E7E7E] leading-6">support@landregistry.gov</p>
                </div>
              </div>

              {/* Appointments */}
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-[#00508E] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-[20px] font-medium text-black leading-6 mb-1">Appointments</h3>
                  <p className="text-[20px] text-[#7E7E7E] leading-6">Book an in-person visit online.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image with Address Overlay */}
          <div className="flex-1 relative">
            <img
              src="/modern-government-building.png"
              alt="Department of Land Registration building"
              className="w-full h-[505px] object-cover rounded-[37px]"
            />

            {/* Address Overlay */}
            <div className="absolute bottom-8 left-8 bg-white rounded-lg border border-[#F2F2F2] px-4 py-3 flex items-center gap-3 shadow-sm">
              <MapPin className="w-3 h-3 text-[#00508E] flex-shrink-0" />
              <span className="text-xs text-[#00508E] leading-[14.4px]">123 Registry Avenue, Capital City</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
