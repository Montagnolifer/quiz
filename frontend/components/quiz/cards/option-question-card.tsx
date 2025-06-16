"use client"
import { Button } from "@/components/ui/button"
import type { ThemeSettings } from "@/types/theme"

type OptionQuestionCardProps = {
  node: any
  selectedOption: string | null
  onOptionSelect: (optionId: string) => void
  onNext: () => void
  theme: ThemeSettings
}

export function OptionQuestionCard({ node, selectedOption, onOptionSelect, onNext, theme }: OptionQuestionCardProps) {
  if (!node || node.type !== "optionQuestion") return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: theme.headerColor }}>
        {node.data?.title || "Question"}
      </h2>

      <div className="space-y-3">
        {node.data.description && <p className="text-center text-sm mb-4">{node.data.description}</p>}
        {node.data.options.map((option: any) => (
          <div
            key={option.id}
            className={`p-4 rounded-xl cursor-pointer transition-all`}
            style={{
              backgroundColor: selectedOption === option.id ? `${theme.buttonColor}20` : "white",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: selectedOption === option.id ? theme.buttonColor : "#e5e7eb",
              borderRadius: `${theme.borderRadius}rem`,
            }}
            onClick={() => onOptionSelect(option.id)}
          >
            {option.text}
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
