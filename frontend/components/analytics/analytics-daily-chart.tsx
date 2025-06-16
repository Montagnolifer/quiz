"use client"

import { useMemo } from "react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type AnalyticsDailyChartProps = {
  attempts: any[]
  partialAttempts: any[]
  days?: number
}

export default function AnalyticsDailyChart({ attempts, partialAttempts, days = 30 }: AnalyticsDailyChartProps) {
  const chartData = useMemo(() => {
    // Get date range based on the selected days
    const today = new Date()
    const startDate = subDays(today, days)

    // Create array of all dates in range
    const dateRange = eachDayOfInterval({
      start: startDate,
      end: today,
    })

    // Initialize data with all dates and zero counts
    const data = dateRange.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      return {
        date: dateStr,
        displayDate: format(date, "MMM d"),
        visits: 0,
        completions: 0,
      }
    })

    // Count attempts by date
    attempts.forEach((attempt) => {
      const dateStr = format(new Date(attempt.created_at), "yyyy-MM-dd")
      const dataPoint = data.find((d) => d.date === dateStr)
      if (dataPoint) {
        dataPoint.completions += 1
        dataPoint.visits += 1
      }
    })

    // Count partial attempts by date
    partialAttempts.forEach((attempt) => {
      const dateStr = format(new Date(attempt.created_at), "yyyy-MM-dd")
      const dataPoint = data.find((d) => d.date === dateStr)
      if (dataPoint) {
        dataPoint.visits += 1
      }
    })

    return data
  }, [attempts, partialAttempts, days])

  return (
    <ChartContainer
      config={{
        visits: {
          label: "Total Visits",
          color: "hsl(var(--chart-1))",
        },
        completions: {
          label: "Completions",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="visits" stroke="var(--color-visits)" strokeWidth={2} activeDot={{ r: 6 }} />
          <Line
            type="monotone"
            dataKey="completions"
            stroke="var(--color-completions)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
