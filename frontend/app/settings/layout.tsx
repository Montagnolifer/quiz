import type React from "react"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { mainNavItems, sidebarSections, sidebarFooterItems } from "@/config/navigation"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const sidebarState = cookieStore.get("sidebar:state")
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen flex-col w-full">
        <DashboardHeader mainNavItems={mainNavItems} />
        <div className="flex flex-1 w-full">
          <SidebarNav
            sections={sidebarSections}
            footerItems={sidebarFooterItems}
            searchPlaceholder="Search quizzes..."
          />
          <SidebarInset className="w-full">
            <main className="flex-1 p-6 w-full">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
