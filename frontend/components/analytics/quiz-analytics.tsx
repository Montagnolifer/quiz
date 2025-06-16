"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart2, Users, Calendar } from "lucide-react"
import FunnelChart from "./funnel-chart"
import QuestionAnalytics from "./question-analytics"
import AttemptsList from "./attempts-list"

type QuizAnalyticsProps = {
  quizId: string
  quiz: any
  attempts: any[]
  analyticsData: any
}

export default function QuizAnalytics({ quizId, quiz, attempts, analyticsData }: QuizAnalyticsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const { totalAttempts, funnelSteps, questionAnalytics } = analyticsData

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Quiz Analytics</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{totalAttempts}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{funnelSteps[funnelSteps.length - 1]?.percentage || 0}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Attempt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">
                  {attempts.length > 0 ? new Date(attempts[0].created_at).toLocaleDateString() : "No attempts"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="attempts">Attempts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>User Progression Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                {totalAttempts > 0 ? (
                  <FunnelChart steps={funnelSteps} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No attempts recorded yet. Share your quiz to start collecting data.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <QuestionAnalytics questionAnalytics={questionAnalytics} totalAttempts={totalAttempts} />
          </TabsContent>

          <TabsContent value="attempts">
            <AttemptsList attempts={attempts} quiz={quiz} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
