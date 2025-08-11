import { Calendar } from "lucide-react"

export default function AnnouncementsSection() {
  const announcements = [
    {
      id: 1,
      date: "Aug 01, 2025",
      title: "Online payment maintenance window",
      description: "Payment services will be unavailable on Aug 12 from 01:00–03:00.",
    },
    {
      id: 2,
      date: "Aug 01, 2025",
      title: "Online payment maintenance window",
      description: "Payment services will be unavailable on Aug 12 from 01:00–03:00.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-black mb-3">Announcements</h2>
            <p className="text-xl text-[#00508E]">Latest updates and notices from the Department.</p>
          </div>
          <div className="text-xl text-black hover:text-[#00508E] cursor-pointer transition-all duration-300 hover:scale-105">
            View all Announcement
          </div>
        </div>

        {/* Announcement Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-2xl border border-[#D3D1D1] shadow-lg p-5 h-40 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-100 hover:border-[#00508E] group"
            >
              {/* Date with icon */}
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600 group-hover:text-[#00508E] transition-colors duration-300" />
                <span className="text-xs text-[#6C6B6B] group-hover:text-[#00508E] transition-colors duration-300">
                  {announcement.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xs font-semibold text-black mb-3 group-hover:text-[#00508E] transition-colors duration-300">
                {announcement.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-black mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {announcement.description}
              </p>

              {/* Read more link */}
              <div className="mt-auto">
                <span className="text-xs text-black cursor-pointer hover:text-[#00508E] transition-all duration-300 hover:font-medium hover:underline">
                  Read more
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
