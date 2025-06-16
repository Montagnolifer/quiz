"use client"

import { useState } from "react"
import { subDays } from "date-fns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnalyticsDailyChart from "./analytics-daily-chart"

type AnalyticsDailyChartTabsProps = {
  attempts: any[]
  partialAttempts: any[]
}

export default function AnalyticsDailyChartTabs({ attempts, partialAttempts }: AnalyticsDailyChartTabsProps) {
  const [dateRange, setDateRange] = useState<"7days" | "15days" | "30days">("7days")

  // Filter attempts based on selected date range
  const filterAttemptsByDate = (data: any[], days: number) => {
    const cutoffDate = subDays(new Date(), days).getTime()
    return data.filter((item) => new Date(item.created_at).getTime() >= cutoffDate)
  }

  const daysMap = {
    "7days": 7,
    "15days": 15,
    "30days": 30,
  }

  const filteredAttempts = filterAttemptsByDate(attempts, daysMap[dateRange])
  const filteredPartialAttempts = filterAttemptsByDate(partialAttempts, daysMap[dateRange])

  return (
    <div className="w-full">
      <Tabs value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
        <TabsList>
          <TabsTrigger value="7days">7 days</TabsTrigger>
          <TabsTrigger value="15days">15 days</TabsTrigger>
          <TabsTrigger value="30days">30 days</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 h-[400px] w-full">
        <AnalyticsDailyChart
          attempts={filteredAttempts}
          partialAttempts={filteredPartialAttempts}
          days={daysMap[dateRange]}
        />
      </div>
    </div>
  )
}
