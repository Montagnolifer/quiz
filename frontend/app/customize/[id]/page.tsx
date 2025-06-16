"use client"

import ThemeCustomizer from "@/components/customize/theme-customizer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import RequireToken from "@/hooks/require-token"

export default function CustomizePage({ params }: { params: { id: string } }) {
  return (
    <RequireToken>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col w-full">
          <DashboardHeader />

          <div className="flex flex-1 w-full">
            <SidebarNav />

            <SidebarInset className="w-full">
              <main className="flex-1 p-6 w-full space-y-8">
                <ThemeCustomizer quizId={params.id} />
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </RequireToken>
  )
}
