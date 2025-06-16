'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import RequireToken from '@/hooks/require-token'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <RequireToken>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col w-full">
          <DashboardHeader />
          <div className="flex flex-1 w-full">
            <SidebarNav />
            <SidebarInset className="w-full">
              <main className="flex-1 p-6 w-full space-y-8">{children}</main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </RequireToken>
  )
}
