"use client"

import { useMemo } from "react"
import { AlertTriangle, CheckCircle, TrendingDown, Lightbulb, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AnalyticsDiagnosticsProps = {
  analytics: any
  quiz: any
}

export default function AnalyticsDiagnostics({ analytics, quiz }: AnalyticsDiagnosticsProps) {
  const diagnostics = useMemo(() => {
    const results = []

    // Check for high drop-off points
    const funnelSteps = analytics.funnelSteps || []
    for (let i = 1; i < funnelSteps.length - 1; i++) {
      const currentStep = funnelSteps[i]
      const prevStep = funnelSteps[i - 1]

      if (prevStep && currentStep) {
        const dropOffPercentage = 100 - (currentStep.percentage / prevStep.percentage) * 100

        if (dropOffPercentage > 30) {
          results.push({
            type: "warning",
            title: `High drop-off at ${currentStep.name}`,
            description: `${Math.round(dropOffPercentage)}% of users drop off at this step. Consider simplifying the question or making it more engaging.`,
            icon: <TrendingDown className="h-5 w-5 text-red-500" />,
          })
        }
      }
    }

    // Check completion rate
    if (analytics.completionRate < 40) {
      results.push({
        type: "warning",
        title: "Low completion rate",
        description:
          "Your quiz has a low completion rate. Consider shortening it or making the questions more engaging.",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      })
    } else if (analytics.completionRate > 70) {
      results.push({
        type: "success",
        title: "Great completion rate",
        description: "Your quiz has an excellent completion rate. Users are engaged with your content.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
    }

    // Check for quiz length
    const questionNodes =
      quiz.flow_data?.nodes?.filter((node: any) =>
        ["optionQuestion", "imageQuestion", "textInput"].includes(node.type),
      ) || []

    if (questionNodes.length > 10) {
      results.push({
        type: "warning",
        title: "Quiz may be too long",
        description:
          "Your quiz has many questions. Consider splitting it into multiple shorter quizzes for better engagement.",
        icon: <Clock className="h-5 w-5 text-orange-500" />,
      })
    }

    // Add general recommendations
    results.push({
      type: "info",
      title: "Optimize for mobile users",
      description: "Ensure your quiz works well on mobile devices as many users access quizzes on smartphones.",
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
    })

    // If no issues found
    if (results.length === 1) {
      results.unshift({
        type: "success",
        title: "Your quiz is performing well",
        description: "No major issues detected. Continue monitoring performance for optimization opportunities.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
    }

    return results
  }, [analytics, quiz])

  return (
    <div className="space-y-4">
      {diagnostics.map((diagnostic, index) => (
        <Alert key={index} variant={diagnostic.type === "warning" ? "destructive" : "default"}>
          <div className="flex items-start">
            {diagnostic.icon}
            <div className="ml-3">
              <AlertTitle>{diagnostic.title}</AlertTitle>
              <AlertDescription>{diagnostic.description}</AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
