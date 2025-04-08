import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Béisbol App Interactiva",
  description: "Aplicación para seguimiento de juegos de béisbol en tiempo real",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main className="min-h-screen bg-gray-50">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'