"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ProfileImageUpload } from "./profile-image-upload"

interface ProfileSettingsFormProps {
  user: User
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [name, setName] = useState(user.user_metadata?.name || "")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.user_metadata?.avatar_url && typeof user.user_metadata.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null,
  )
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Get user initials for avatar fallback
  const userInitials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) ||
    user.email?.substring(0, 2).toUpperCase() ||
    "U"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name,
        },
      })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <ProfileImageUpload
          userId={user.id}
          initialAvatarUrl={avatarUrl}
          userInitials={userInitials}
          onAvatarUpdate={setAvatarUrl}
        />
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
            <p className="text-sm text-muted-foreground">Your email address is used for login and cannot be changed.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
