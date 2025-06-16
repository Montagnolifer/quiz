"use client"

import { useMemo } from "react"
import type { FunnelStep } from "@/lib/database-types"

type FunnelChartProps = {
  steps: FunnelStep[]
}

export default function FunnelChart({ steps }: FunnelChartProps) {
  // Calculate the maximum width for scaling
  const maxValue = useMemo(() => {
    return Math.max(...steps.map((step) => step.value))
  }, [steps])

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        // Calculate width percentage based on the max value
        const widthPercentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0

        // Calculate color based on position in funnel
        const colorClass = index === 0 ? "bg-blue-500" : index === steps.length - 1 ? "bg-green-500" : "bg-indigo-500"

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{step.name}</span>
              <span className="text-muted-foreground">
                {step.value} ({step.percentage}%)
              </span>
            </div>
            <div className="h-8 w-full bg-gray-100 rounded-md overflow-hidden">
              <div
                className={`h-full ${colorClass} transition-all duration-500 flex items-center px-3`}
                style={{ width: `${widthPercentage}%` }}
              >
                {widthPercentage > 15 && <span className="text-white text-xs font-medium">{step.value}</span>}
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
