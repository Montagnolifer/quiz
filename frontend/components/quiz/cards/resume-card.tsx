"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ThemeSettings } from "@/types/theme"
import { RotateCcw } from "lucide-react"

type ResumeCardProps = {
  theme: ThemeSettings
  progress: number
  onResume: () => void
  onStartNew: () => void
}

export function ResumeCard({ theme, progress, onResume, onStartNew }: ResumeCardProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
      }}
    >
      <Card
        className="max-w-md w-full"
        style={{
          backgroundColor: theme.cardColor,
          borderRadius: `${theme.borderRadius}rem`,
        }}
      >
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center" style={{ color: theme.headerColor }}>
            Resume Quiz
          </h2>
          <p className="text-center">You have a quiz in progress. Would you like to resume where you left off?</p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full"
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
                borderRadius: `${theme.borderRadius}rem`,
              }}
              onClick={onResume}
            >
              Resume Quiz ({progress || 0}% Complete)
            </Button>
            <Button
              variant="outline"
              className="w-full"
              style={{
                borderRadius: `${theme.borderRadius}rem`,
              }}
              onClick={onStartNew}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Attempt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
