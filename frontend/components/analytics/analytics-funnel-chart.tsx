"use client"

import { useMemo } from "react"

type FunnelStep = {
  name: string
  value: number
  percentage: number
}

type AnalyticsFunnelChartProps = {
  steps: FunnelStep[]
}

export default function AnalyticsFunnelChart({ steps }: AnalyticsFunnelChartProps) {
  // Calculate the maximum width for scaling
  const maxValue = useMemo(() => {
    return Math.max(...steps.map((step) => step.value))
  }, [steps])

  // Determine drop-off severity for each step
  const getDropOffSeverity = (currentIndex: number) => {
    if (currentIndex === 0 || currentIndex === steps.length - 1) return null

    const currentStep = steps[currentIndex]
    const prevStep = steps[currentIndex - 1]

    if (!prevStep || !currentStep) return null

    const dropOffPercentage = 100 - (currentStep.percentage / prevStep.percentage) * 100

    if (dropOffPercentage > 30) return "high"
    if (dropOffPercentage > 15) return "medium"
    return "low"
  }

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        // Calculate width percentage based on the max value
        const widthPercentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0

        // Calculate color based on position in funnel and drop-off severity
        const dropOffSeverity = getDropOffSeverity(index)
        let colorClass = index === 0 ? "bg-blue-500" : index === steps.length - 1 ? "bg-green-500" : "bg-indigo-500"

        if (dropOffSeverity === "high") {
          colorClass = "bg-red-500"
        } else if (dropOffSeverity === "medium") {
          colorClass = "bg-orange-500"
        }

        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <span className="font-medium">{step.name}</span>
                {dropOffSeverity === "high" && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    High Drop-off
                  </span>
                )}
                {dropOffSeverity === "medium" && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    Medium Drop-off
                  </span>
                )}
              </div>
              <span className="text-muted-foreground">
                {step.value} ({step.percentage}%)
              </span>
            </div>
            <div className="h-10 w-full bg-gray-100 rounded-md overflow-hidden">
              <div
                className={`h-full ${colorClass} transition-all duration-500 flex items-center px-3`}
                style={{ width: `${widthPercentage}%` }}
              >
                {widthPercentage > 15 && <span className="text-white text-sm font-medium">{step.value}</span>}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex justify-center">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-gray-200 border-r-[10px] border-r-transparent" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
