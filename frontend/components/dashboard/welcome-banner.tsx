"use client"

import { useAuth } from "@/contexts/auth-context"

export function WelcomeBanner() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.name?.split(" ")[0] || "there"

  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">Create, manage, and share interactive quizzes with your audience.</p>
      </div>
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-primary/10" />
      <div className="absolute right-8 top-8 h-16 w-16 rounded-full bg-primary/20" />
      <div className="absolute right-12 top-12 h-8 w-8 rounded-full bg-primary/30" />
    </div>
  )
}
