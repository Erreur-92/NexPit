import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | NexPit",
    default: "NexPit",
  },
  icons: {
    icon: "/NexPit_N.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={cn(geistSans.variable, geistMono.variable, instrumentSerif.variable)}>
        <Script
          defer
          src="https://analytics.derrien.tech/script.js"
          data-website-id="3264c3df-abf9-4563-a2ca-264f1da40dd0"
        />
        {children}
      </body>
    </html>
  )
}
