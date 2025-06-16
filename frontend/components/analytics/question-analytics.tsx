"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionAnalytic } from "@/lib/database-types"

type QuestionAnalyticsProps = {
  questionAnalytics: QuestionAnalytic[]
  totalAttempts: number
}

export default function QuestionAnalytics({ questionAnalytics, totalAttempts }: QuestionAnalyticsProps) {
  if (totalAttempts === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          No attempts recorded yet. Share your quiz to start collecting data.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {questionAnalytics.map((question, index) => (
        <Card key={question.nodeId}>
          <CardHeader>
            <CardTitle className="text-lg">
              {index + 1}. {question.title || `Question ${index + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {question.type === "textInput" ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Text input field - Individual responses can be viewed in the Attempts tab
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Total responses: {question.totalAnswers} of {totalAttempts} attempts
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {question.options?.map((option) => (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-muted-foreground">
                        {option.count} ({option.percentage}%)
                      </span>
                    </div>
                    <div className="h-6 w-full bg-gray-100 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-4 text-sm text-muted-foreground">
                  Total answers: {question.totalAnswers} of {totalAttempts} attempts
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
