"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { DynamicBanner } from "@/components/dashboard/dynamic-banner"
import { QuickAccessCard } from "@/components/dashboard/quick-access-card"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import RequireToken from "@/hooks/require-token"

export default function DashboardPage() {
  
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const raw = localStorage.getItem("token")
    if (!raw) {
      router.push("/login")
    } else {
      // Simula carregamento do usuário
      setUser({ email: "demo@user.com" })
    }
  }, [])

  if (!user) return null

  const quizCount = 5

  return (
    <RequireToken>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col w-full">
          <DashboardHeader />

          <div className="flex flex-1 w-full">
            <SidebarNav />

            <SidebarInset className="w-full">
              <main className="flex-1 p-6 w-full space-y-8">
                <DynamicBanner />

                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Quick Access
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickAccessCard
                      title="My Quizzes"
                      description="View and manage all your created quizzes"
                      icon={FileText}
                      href="/dashboard/quizzes"
                      stats={{
                        value: quizCount,
                        label: "Total Quizzes",
                      }}
                      className="md:col-span-1"
                    />
                  </div>
                </div>
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </RequireToken>
  )
}
