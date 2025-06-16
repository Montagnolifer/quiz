"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

type ResultProfile = {
  id: string
  name: string
  value: number
  percentage: number
}


type AnalyticsResultProfilesProps = {
  attempts: any[]
  quiz: any
}

export default function AnalyticsResultProfiles({ attempts, quiz }: AnalyticsResultProfilesProps) {
  const resultData: ResultProfile[] = useMemo(() => {
    // Get all result nodes from the quiz
    const resultNodes = quiz.flow_data?.nodes?.filter((node: any) => node.type === "result") || []

    // Count attempts by result node
    const resultCounts: Record<string, number> = {}
    resultNodes.forEach((node: any) => {
      resultCounts[node.id] = 0
    })

    attempts.forEach((attempt) => {
      if (attempt.result_node_id && resultCounts[attempt.result_node_id] !== undefined) {
        resultCounts[attempt.result_node_id] += 1
      }
    })

    // Create data for chart
    return resultNodes
      .map((node: any) => {
        const count = resultCounts[node.id] || 0
        const percentage = attempts.length > 0 ? Math.round((count / attempts.length) * 100) : 0

        return {
          id: node.id,
          name: node.data.title || "Unnamed Result",
          value: count,
          percentage,
        }
      })
      .filter((item: ResultProfile) => item.value > 0)
  }, [attempts, quiz])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  if (resultData.length === 0) {
    return <div className="text-center py-8 text-gray-500">No completed quizzes yet.</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={resultData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {resultData.map((entry: ResultProfile, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} (${resultData.find((d) => d.name === name)?.percentage}%)`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
