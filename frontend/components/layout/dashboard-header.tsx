import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { Search } from "@/components/layout/search"
import { Notifications } from "@/components/layout/notifications"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background w-full">
      <div className="flex h-16 items-center px-4 w-full">
        <SidebarTrigger className="mr-2" />
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <Notifications />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
