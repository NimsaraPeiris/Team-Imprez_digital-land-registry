import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { TranslationProvider } from "@/contexts/translation-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Department of Land Registration",
  description: "Official website for the Department of Land Registration root",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TranslationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
