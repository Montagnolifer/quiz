"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut, Home, Layers, Layout, FileText, Palette, UserCog, PlusCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
} from "@/components/ui/sidebar"

export function SidebarNav() {
  const pathname = usePathname()

  const sections = [
    {
      title: "Main",
      items: [
        { title: "Home", href: "/dashboard", icon: Home },
        { title: "My Quizzes", href: "/dashboard/quizzes", icon: Layers },
      ],
    },
    /*{
      title: "Community",
      items: [
        { title: "University", href: "/templates", icon: FileText },
        { title: "Group Whatsapp", href: "/themes", icon: Palette },
      ],
    },*/
    {
      title: "Settings",
      items: [
        { title: "Profile", href: "/settings", icon: UserCog },
        { title: "Logout", href: "/login", icon: LogOut, isLogout: true },
      ],
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <Sidebar className="h-full">
      <SidebarHeader>
        <form className="px-2 py-2">
          <SidebarInput placeholder="Search..." />
        </form>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item, j) => (
                  <SidebarMenuItem key={j}>
                    {item.isLogout ? (
                      <SidebarMenuButton onClick={handleLogout}>
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.title}
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-center text-sm text-muted-foreground">
          Criado com 🩷 por QuizFlow
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
