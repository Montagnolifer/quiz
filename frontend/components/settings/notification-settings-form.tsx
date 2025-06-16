"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface NotificationSettings {
  quizCompletions: boolean
  newResults: boolean
  marketing: boolean
}

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings
  userId: string
}

export function NotificationSettingsForm({ initialSettings, userId }: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          notification_settings: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) throw error

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      console.error("Error saving notification settings:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="quiz-completions">Quiz Completions</Label>
            <p className="text-sm text-muted-foreground">Receive notifications when someone completes your quiz</p>
          </div>
          <Switch
            id="quiz-completions"
            checked={settings.quizCompletions}
            onCheckedChange={(checked) => setSettings({ ...settings, quizCompletions: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="new-results">New Results</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about new quiz results and analytics</p>
          </div>
          <Switch
            id="new-results"
            checked={settings.newResults}
            onCheckedChange={(checked) => setSettings({ ...settings, newResults: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Marketing</Label>
            <p className="text-sm text-muted-foreground">Receive emails about new features and promotional offers</p>
          </div>
          <Switch
            id="marketing"
            checked={settings.marketing}
            onCheckedChange={(checked) => setSettings({ ...settings, marketing: checked })}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </form>
  )
}
