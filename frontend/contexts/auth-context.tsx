"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOut as localSignOut } from "@/lib/local-storage"
import type { User } from "@/lib/local-storage"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get user from localStorage
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signOut = async () => {
    await localSignOut()
    setUser(null)
    router.push("/login")
    router.refresh()
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
