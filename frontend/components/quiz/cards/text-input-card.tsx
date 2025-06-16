"use client"

import { Button } from "@/components/ui/button"
import type { ThemeSettings } from "@/types/theme"

type TextInputCardProps = {
  node: any
  textInputValue: string
  onTextInputChange: (value: string) => void
  onNext: () => void
  theme: ThemeSettings
  applyMask: (value: string, mask: string) => string
}

export function TextInputCard({
  node,
  textInputValue,
  onTextInputChange,
  onNext,
  theme,
  applyMask,
}: TextInputCardProps) {
  if (!node || node.type !== "textInput") return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center" style={{ color: theme.headerColor }}>
        {node.data?.title || "Question"}
      </h2>

      <div className="space-y-4">
        {node.data.description && <p className="text-center text-sm mb-4">{node.data.description}</p>}
        <div className="w-full">
          {node.data.fieldType === "textarea" ? (
            <textarea
              className="w-full p-3 border rounded-md"
              style={{
                borderRadius: `${theme.borderRadius}rem`,
                borderColor: textInputValue ? theme.buttonColor : "#e5e7eb",
              }}
              placeholder={node.data.placeholder || "Enter your answer..."}
              value={textInputValue || ""}
              onChange={(e) => {
                const value = e.target.value
                if (node.data.mask) {
                  onTextInputChange(applyMask(value, node.data.mask))
                } else {
                  onTextInputChange(value)
                }
              }}
              required={node.data.required}
              rows={4}
            />
          ) : (
            <input
              type={node.data.fieldType || "text"}
              className="w-full p-3 border rounded-md"
              style={{
                borderRadius: `${theme.borderRadius}rem`,
                borderColor: textInputValue ? theme.buttonColor : "#e5e7eb",
              }}
              placeholder={node.data.placeholder || "Enter your answer..."}
              value={textInputValue || ""}
              onChange={(e) => {
                const value = e.target.value
                if (node.data.mask) {
                  onTextInputChange(applyMask(value, node.data.mask))
                } else {
                  onTextInputChange(value)
                }
              }}
              required={node.data.required}
            />
          )}
        </div>
      </div>

      <Button
        className="w-full"
        style={{
          backgroundColor: theme.buttonColor,
          color: theme.buttonTextColor,
          borderRadius: `${theme.borderRadius}rem`,
        }}
        disabled={node.data.required && (!textInputValue || textInputValue.trim() === "")}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  )
}
