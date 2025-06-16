"use client"

import { Button } from "@/components/ui/button"
import type { ThemeSettings } from "@/types/theme"

type ImageQuestionCardProps = {
  node: any
  selectedOption: string | null
  onOptionSelect: (optionId: string) => void
  onNext: () => void
  theme: ThemeSettings
  imageErrors: Record<string, boolean>
  onImageError: (optionId: string) => void
}

export function ImageQuestionCard({
  node,
  selectedOption,
  onOptionSelect,
  onNext,
  theme,
  imageErrors,
  onImageError,
}: ImageQuestionCardProps) {
  if (!node || node.type !== "imageQuestion") return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: theme.headerColor }}>
        {node.data?.title || "Question"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {node.data.description && <p className="text-center text-sm mb-4 col-span-2">{node.data.description}</p>}
        {node.data.options.map((option: any) => (
          <div
            key={option.id}
            className={`flex flex-col items-center p-3 cursor-pointer transition-all`}
            style={{
              backgroundColor: selectedOption === option.id ? `${theme.buttonColor}20` : "white",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: selectedOption === option.id ? theme.buttonColor : "#e5e7eb",
              borderRadius: `${theme.borderRadius}rem`,
            }}
            onClick={() => onOptionSelect(option.id)}
          >
            <div className="w-full h-24 mb-2 overflow-hidden" style={{ borderRadius: `${theme.borderRadius}rem` }}>
              {option.imageUrl && !imageErrors[option.id] ? (
                <img
                  src={option.imageUrl || "/placeholder.svg"}
                  alt={option.text || "Option image"}
                  className="w-full h-full object-cover"
                  onError={() => onImageError(option.id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                  {imageErrors[option.id] ? "Image failed to load" : "No image"}
                </div>
              )}
            </div>
            <span className="text-center">{option.text}</span>
          </div>
        ))}
      </div>

      <Button
        className="w-full"
        style={{
          backgroundColor: theme.buttonColor,
          color: theme.buttonTextColor,
          borderRadius: `${theme.borderRadius}rem`,
        }}
        disabled={!selectedOption}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  )
}
