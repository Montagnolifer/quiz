"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "@/components/theme-provider"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export function DisplaySettingsForm() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">(theme)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()

  const handleSaveSettings = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Save to local storage and apply theme
      setTheme(selectedTheme)

      // Save to database if user is logged in
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          theme: selectedTheme,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your display settings have been updated.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display</CardTitle>
        <CardDescription>Manage your display preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <RadioGroup
            id="theme"
            value={selectedTheme}
            onValueChange={(value) => setSelectedTheme(value as "light" | "dark" | "system")}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only peer" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                Light
              </Label>
            </div>

            <div>
              <RadioGroupItem value="dark" id="dark" className="sr-only peer" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Dark
              </Label>
            </div>

            <div>
              <RadioGroupItem value="system" id="system" className="sr-only peer" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                System
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
