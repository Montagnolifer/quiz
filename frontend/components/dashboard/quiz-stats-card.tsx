"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Users } from "lucide-react"
import type { QuizAnalytics } from "@/lib/database-types"

type QuizStatsCardProps = {
  quizId: string
}

export default function QuizStatsCard({ quizId }: QuizStatsCardProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/quizzes/${quizId}/analytics`)
        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }

        const data = await response.json()
        setAnalytics(data.analytics)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [quizId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-destructive">Error loading analytics: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{analytics.totalAttempts}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BarChart className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{analytics.completionRate}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Most Popular Question</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.questionAnalytics.length > 0 ? (
            <div className="text-sm line-clamp-2">
              {analytics.questionAnalytics.sort((a, b) => b.totalAnswers - a.totalAnswers)[0]?.title || "N/A"}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No questions answered yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
