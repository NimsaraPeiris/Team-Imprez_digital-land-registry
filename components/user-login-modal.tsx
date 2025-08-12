"use client"

import { X } from "lucide-react"

interface UserLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserLoginModal({ isOpen, onClose }: UserLoginModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden w-full max-w-2xl p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-center text-4xl font-extrabold mb-12 text-black">User Login</h2>

        <form>
          <div className="mb-6">
            <label htmlFor="id-number" className="block text-xl font-semibold mb-2 text-black">
              Enter Id Number :
            </label>
            <input
              id="id-number"
              type="text"
              placeholder="XXXXXXXXXXXXXXV"
              className="w-full p-3 bg-[#E9E9E9] rounded-md text-[#636363] placeholder:text-[#636363] text-sm"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="phone-number" className="block text-xl font-semibold mb-2 text-black">
              Phone Number :
            </label>
            <input
              id="phone-number"
              type="text"
              placeholder="0000 000 000"
              className="w-full p-3 bg-[#E9E9E9] rounded-md text-[#636363] placeholder:text-[#636363] text-sm"
            />
          </div>

          <div className="flex gap-x-5 mt-10">
            <button
              type="submit"
              className="bg-[#002E51] text-white text-xl font-normal px-10 py-4 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Send OTP
            </button>
            <button
              type="button"
              className="bg-white text-black text-xl font-normal px-10 py-4 rounded-lg border border-black hover:bg-gray-100 transition-colors"
            >
              New User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
