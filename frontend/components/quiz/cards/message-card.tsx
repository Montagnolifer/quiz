"use client"

import { Button } from "@/components/ui/button"
import type { ThemeSettings } from "@/types/theme"

type MessageCardProps = {
  node: any
  onNext: () => void
  theme: ThemeSettings
  timeRemaining: number | null
  imageErrors: Record<string, boolean>
  onImageError: () => void
}

export function MessageCard({ node, onNext, theme, timeRemaining, imageErrors, onImageError }: MessageCardProps) {
  if (!node || node.type !== "message") return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: theme.headerColor }}>
        {node.data?.title || "Message"}
      </h2>

      <div className="space-y-4">
        <p className="text-center">{node.data.description}</p>

        {node.data.mediaType === "image" && node.data.mediaUrl && !imageErrors["message"] ? (
          <div className="w-full overflow-hidden" style={{ borderRadius: `${theme.borderRadius}rem` }}>
            <img
              src={node.data.mediaUrl || "/placeholder.svg"}
              alt={node.data.title || "Message image"}
              className="w-full object-cover"
              onError={onImageError}
            />
          </div>
        ) : node.data.mediaType === "image" && imageErrors["message"] ? (
          <div
            className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400"
            style={{ borderRadius: `${theme.borderRadius}rem` }}
          >
            Image failed to load
          </div>
        ) : null}

        {node.data.mediaType === "video" && node.data.mediaUrl && (
          <div className="w-full overflow-hidden" style={{ borderRadius: `${theme.borderRadius}rem` }}>
            <video src={node.data.mediaUrl} controls className="w-full" onError={onImageError} />
            {imageErrors["message"] && (
              <div className="w-full p-4 text-center bg-gray-100 text-gray-400">Video failed to load</div>
            )}
          </div>
        )}

        {timeRemaining !== null && timeRemaining > 0 && (
          <div className="text-center" style={{ color: theme.headerColor }}>
            Please wait {timeRemaining} seconds...
          </div>
        )}
      </div>

      <Button
        className="w-full"
        style={{
          backgroundColor: theme.buttonColor,
          color: theme.buttonTextColor,
          borderRadius: `${theme.borderRadius}rem`,
        }}
        disabled={timeRemaining !== null && timeRemaining > 0}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  )
}
