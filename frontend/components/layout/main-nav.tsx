"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MainNavProps } from "@/types/navigation"

export function MainNav({ items = [], logoText = "QuizFlow", logoHref = "/dashboard" }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href={logoHref} className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">{logoText}</span>
      </Link>
    </div>
  )
}
