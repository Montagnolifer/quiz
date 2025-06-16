import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomCookiesProvider } from "@/components/cookies-provider" // novo

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CustomCookiesProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </CustomCookiesProvider>
      </body>
    </html>
  )
}
