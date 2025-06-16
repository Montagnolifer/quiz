"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ProfileImageUploadProps {
  userId: string
  initialAvatarUrl?: string
  userInitials: string
  onAvatarUpdate: (url: string | null) => void
}

export function ProfileImageUpload({
  userId,
  initialAvatarUrl,
  userInitials,
  onAvatarUpdate,
}: ProfileImageUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Convert file to base64 for local storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64Url = event.target?.result as string

        // Store in localStorage (in a real app, you'd upload to a server)
        localStorage.setItem(`avatar_${userId}`, base64Url)

        setAvatarUrl(base64Url)
        onAvatarUpdate(base64Url)

        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        })
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true)

      // Remove from localStorage
      localStorage.removeItem(`avatar_${userId}`)

      setAvatarUrl(null)
      onAvatarUpdate(null)

      toast({
        title: "Profile picture removed",
        description: "Your profile picture has been removed.",
      })
    } catch (error) {
      console.error("Error removing avatar:", error)
      toast({
        title: "Action failed",
        description: "There was an error removing your profile picture.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={avatarUrl || ""}
          alt="Profile"
          onError={(e) => {
            // Hide the image element when it fails to load
            e.currentTarget.style.display = "none"
          }}
        />
        <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => document.getElementById("avatar-upload")?.click()}
        >
          {isUploading ? "Uploading..." : "Change"}
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={handleRemoveAvatar}
          disabled={isUploading || !avatarUrl}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
