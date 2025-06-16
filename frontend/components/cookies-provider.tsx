"use client"

import { CookiesProvider } from "react-cookie"

export function CustomCookiesProvider({ children }: { children: React.ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>
}
