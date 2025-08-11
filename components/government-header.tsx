import Image from "next/image"

export default function GovernmentHeader() {
  return (
    <div className="w-full bg-[#00508E] px-20 py-8 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left section with logo and department info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src="/generic-government-logo.png"
              alt="Department Logo"
              width={42}
              height={42}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-medium leading-7">Department of Land Registration</h1>
            <p className="text-white text-base font-medium leading-5">Digital Services Hub</p>
          </div>
        </div>

        {/* Right section with hotline and language options */}
        <div className="flex items-center gap-16">
          {/* Hotline */}
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold">Hot line:</span>
            <span className="text-white text-lg font-bold">1919</span>
          </div>

          {/* Language options */}
          <div className="flex items-center gap-4">
            <button className="text-white text-lg hover:underline transition-all">සිංහල</button>
            <button className="text-white text-lg font-medium hover:underline transition-all">தமிழ்</button>
            <button className="text-white text-lg font-medium hover:underline transition-all">English</button>
          </div>
        </div>
      </div>
    </div>
  )
}
