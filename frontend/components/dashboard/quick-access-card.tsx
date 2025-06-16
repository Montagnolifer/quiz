import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickAccessCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  className?: string
  stats?: {
    value: number | string
    label: string
  }
}

export function QuickAccessCard({ title, description, icon: Icon, href, className, stats }: QuickAccessCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          {stats && (
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.value}</p>
              <p className="text-xs text-muted-foreground">{stats.label}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Link href={href} className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}>
          View All
        </Link>
      </CardContent>
    </Card>
  )
}
