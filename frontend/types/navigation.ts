import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  isActive?: boolean
  children?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface MainNavProps {
  items?: NavItem[]
  logoText?: string
  logoHref?: string
}

export interface SidebarNavProps {
  sections?: NavSection[]
  searchPlaceholder?: string
  footerItems?: NavItem[]
}
