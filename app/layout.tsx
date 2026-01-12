import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"

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
    default: "NexPit - Newsletter Tech et Web",
  },
  description: "Inscris-toi à la newsletter Nexpit pour recevoir les dernières astuces tech et web directement dans ta boîte mail.",
  keywords: ["newsletter", "tech", "web", "astuces", "Nexpit", "actualité numérique", "développement", "programmation", "tutoriel", "code", "JavaScript", "React", "TypeScript", "frontend", "backend", "automobile", "NexPit", "NexPit Newsletter", "Voiture", "Tech News", "Web Development", "Coding Tips", "Programming", "Software", "Gadgets", "Innovation", "Digital Trends", "Tech Tips", "Web Design", "App Development"],
  authors: [{ name: "Nexpit" }],
  creator: "Nexpit",
  publisher: "Nexpit",
  icons: {
    icon: "/NexPit_N.svg",
  },
  openGraph: {
    title: "Nexpit - Newsletter Tech et Web",
    description: "Reçois les dernières astuces tech et web directement dans ta boîte mail.",
    url: "https://www.nexpit.fr/",
    type: "website",
    siteName: "Nexpit",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexpit - Newsletter Tech et Web",
    description: "Reçois les dernières astuces tech et web directement dans ta boîte mail.",
    site: "@nexpit",
    creator: "@nexpit",
  },
  robots: {
    index: true,
    follow: true,
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
