"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type QuestionAnalytic = {
  nodeId: string
  title: string
  type: "optionQuestion" | "textInput"
  totalAnswers: number
  options?: {
    id: string
    text: string
    count: number
    percentage: number
  }[]
}

type AnalyticsFrequentAnswersProps = {
  questionAnalytics: QuestionAnalytic[]
}

export default function AnalyticsFrequentAnswers({ questionAnalytics }: AnalyticsFrequentAnswersProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(
    questionAnalytics.length > 0 ? questionAnalytics[0].nodeId : null,
  )

  const toggleQuestion = (nodeId: string) => {
    setExpandedQuestion(expandedQuestion === nodeId ? null : nodeId)
  }

  if (questionAnalytics.length === 0) {
    return <div className="text-center py-8 text-gray-500">No answers recorded yet.</div>
  }

  return (
    <div className="space-y-4">
      {questionAnalytics.map((question, index) => {
        const isExpanded = expandedQuestion === question.nodeId

        return (
          <div key={question.nodeId} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleQuestion(question.nodeId)}
            >
              <div>
                <span className="font-medium">Question {index + 1}</span>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{question.title}</p>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="p-4 bg-white">
                {question.type === "textInput" ? (
                  <div className="text-center py-2 text-sm text-gray-500">
                    {question.totalAnswers} text responses collected
                  </div>
                ) : (
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{option.text}</span>
                          <span className="text-gray-500">
                            {option.count} ({option.percentage}%)
                          </span>
                        </div>
                        <Progress value={option.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
