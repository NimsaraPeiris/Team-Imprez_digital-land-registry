"use client"

import React from "react"

export default function ContactSection() {
  return (
    <footer 
      data-section="contact" 
      className="bg-gray-800 text-white py-8 px-4"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-2">
          Land Registry Office, Wariyapola, Sri Lanka
        </p>
        <p className="mb-2">
          Email: contact@landregistry.gov.lk
        </p>
        <p>
          Phone: +94 11 234 5678
        </p>
      </div>
    </footer>
  )
}