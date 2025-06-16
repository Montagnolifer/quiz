import { createServerSupabaseClient } from "@/lib/supabase"
import { getQuizById } from "@/lib/db-utils"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Palette, Eye } from "lucide-react"
import Link from "next/link"
import QuizStatsCard from "@/components/dashboard/quiz-stats-card"
import QuizAttemptsTable from "@/components/dashboard/quiz-attempts-table"

export default async function QuizDashboardPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get the quiz data
  const quiz = await getQuizById(params.id, session.user.id)
  if (!quiz) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/editor/${params.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/customize/${params.id}`}>
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Link>
            </Button>
            {quiz.status === "published" && (
              <Button asChild>
                <Link href={`/quiz/${params.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Quiz
                </Link>
              </Button>
            )}
          </div>
        </div>

        <QuizStatsCard quizId={params.id} />

        <div className="mt-8">
          <Tabs defaultValue="attempts">
            <TabsList className="mb-6">
              <TabsTrigger value="attempts">Recent Attempts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="attempts">
              <Card>
                <CardContent className="pt-6">
                  <QuizAttemptsTable quizId={params.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-sm">
                        {quiz.status === "published" ? (
                          <span className="text-green-600 font-medium">Published</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Draft</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(quiz.created_at).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">{new Date(quiz.updated_at).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="font-medium">Quiz ID</p>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded">{quiz.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
