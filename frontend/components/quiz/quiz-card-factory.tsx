import { OptionQuestionCard } from "./cards/option-question-card"
import { ImageQuestionCard } from "./cards/image-question-card"
import { TextInputCard } from "./cards/text-input-card"
import { MessageCard } from "./cards/message-card"
import { ResultCard } from "./cards/result-card"
import type { ThemeSettings } from "@/types/theme"

type QuizCardFactoryProps = {
  node: any
  selectedOption: string | null
  textInputs: Record<string, string>
  currentNodeId: string
  timeRemaining: number | null
  imageErrors: Record<string, boolean>
  redirectCountdown: number | null
  theme: ThemeSettings
  onOptionSelect: (optionId: string) => void
  onTextInputChange: (value: string) => void
  onNext: () => void
  onImageError: (id: string) => void
  onButtonClick: (url: string) => void
  onStartNew: () => void
  applyMask: (value: string, mask: string) => string
}

export function QuizCardFactory({
  node,
  selectedOption,
  textInputs,
  currentNodeId,
  timeRemaining,
  imageErrors,
  redirectCountdown,
  theme,
  onOptionSelect,
  onTextInputChange,
  onNext,
  onImageError,
  onButtonClick,
  onStartNew,
  applyMask,
}: QuizCardFactoryProps) {
  if (!node) return null

  switch (node.type) {
    case "optionQuestion":
      return (
        <OptionQuestionCard
          node={node}
          selectedOption={selectedOption}
          onOptionSelect={onOptionSelect}
          onNext={onNext}
          theme={theme}
        />
      )
    case "imageQuestion":
      return (
        <ImageQuestionCard
          node={node}
          selectedOption={selectedOption}
          onOptionSelect={onOptionSelect}
          onNext={onNext}
          theme={theme}
          imageErrors={imageErrors}
          onImageError={(id) => onImageError(id)}
        />
      )
    case "textInput":
      return (
        <TextInputCard
          node={node}
          textInputValue={textInputs[currentNodeId] || ""}
          onTextInputChange={onTextInputChange}
          onNext={onNext}
          theme={theme}
          applyMask={applyMask}
        />
      )
    case "message":
      return (
        <MessageCard
          node={node}
          onNext={onNext}
          theme={theme}
          timeRemaining={timeRemaining}
          imageErrors={imageErrors}
          onImageError={() => onImageError("message")}
        />
      )
    case "result":
      return (
        <ResultCard
          node={node}
          theme={theme}
          redirectCountdown={redirectCountdown}
          onButtonClick={onButtonClick}
          onStartNew={onStartNew}
        />
      )
    default:
      return <div>Unknown node type: {node.type}</div>
  }
}
