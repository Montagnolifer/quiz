"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type RequireTokenProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export default function RequireToken({
  children,
  fallback = null,
  redirectTo = "/login",
}: RequireTokenProps) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace(redirectTo)
    } else {
      setChecking(false)
    }
  }, [router, redirectTo])

  if (checking) {
    return <div className="text-center py-8">Verificando acesso...</div>
  }

  return <>{children}</>
}
