import type React from "react"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import RequireToken from "@/hooks/require-token"

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  return (
    <RequireToken>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col w-full">
          <DashboardHeader />

          <div className="flex flex-1 w-full">
            <SidebarNav />

          <SidebarInset className="w-full">
            <main className="flex-1 p-6 w-full">{children}</main>
          </SidebarInset>

          </div>
        </div>
      </SidebarProvider>
    </RequireToken>
  )
}
