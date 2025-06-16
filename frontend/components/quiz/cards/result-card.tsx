"use client"

import { Button } from "@/components/ui/button"
import type { ThemeSettings } from "@/types/theme"
import { ExternalLink, RotateCcw } from "lucide-react"

type ResultCardProps = {
  node: any
  theme: ThemeSettings
  redirectCountdown: number | null
  onButtonClick: (url: string) => void
  onStartNew: () => void
}

export function ResultCard({ node, theme, redirectCountdown, onButtonClick, onStartNew }: ResultCardProps) {
  if (!node || node.type !== "result") return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: theme.headerColor }}>
        {node.data?.title || "Quiz Completed"}
      </h2>
      <p className="text-center">{node.data?.message || "Thank you for completing the quiz!"}</p>

      {/* Show redirect countdown if enabled */}
      {redirectCountdown !== null && node.data?.redirect?.enabled && (
        <div className="text-center text-sm" style={{ color: theme.headerColor }}>
          Redirecting in {redirectCountdown} second{redirectCountdown !== 1 ? "s" : ""}...
        </div>
      )}

      {/* Show buttons if available */}
      {node.data?.buttons && node.data.buttons.length > 0 && (
        <div className="flex flex-col gap-2">
          {node.data.buttons.map((button: any) => (
            <Button
              key={button.id}
              className="w-full flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
                borderRadius: `${theme.borderRadius}rem`,
              }}
              onClick={() => onButtonClick(button.link)}
            >
              {button.label}
              <ExternalLink className="h-4 w-4" />
            </Button>
          ))}
        </div>
      )}

      {/* Add a "Take Quiz Again" button */}
      <Button
        className="w-full"
        style={{
          backgroundColor: theme.buttonColor,
          color: theme.buttonTextColor,
          borderRadius: `${theme.borderRadius}rem`,
        }}
        onClick={onStartNew}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Take Quiz Again
      </Button>
    </div>
  )
}
