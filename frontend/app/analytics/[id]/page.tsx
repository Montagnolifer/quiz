
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Users,
  Mail,
  Phone,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AnalyticsFunnelChart from "@/components/analytics/analytics-funnel-chart"
import AnalyticsFrequentAnswers from "@/components/analytics/analytics-frequent-answers"
import AnalyticsResultProfiles from "@/components/analytics/analytics-result-profiles"
import AnalyticsLeadsTable from "@/components/analytics/analytics-leads-table"
import AnalyticsDiagnostics from "@/components/analytics/analytics-diagnostics"
import AnalyticsDailyChartTabs from "@/components/analytics/analytics-daily-chart-tabs" // Import AnalyticsDailyChartTabs

export default async function AnalyticsPage({ params }: { params: { id: string } }) {
  // 👇 Desestrutura `id` de forma assíncrona
  const { id } = await params

  try {
    // Agora use `id` normalmente
    const resQuiz = await fetch(`http://localhost:3000/quizzes/${id}`)
    const quiz = await resQuiz.json()
    
    const resAttempts = await fetch(`http://localhost:3000/quizzes/quiz-attempts/${id}`)
    const attempts = await resAttempts.json()
    
    const resAnalytics = await fetch(`http://localhost:3000/quizzes/quiz-analytics/${id}`)
    const analytics = await resAnalytics.json()
    
    const resProgress = await fetch(`http://localhost:3000/quizzes/quiz-progress/${id}`)
    const partialAttempts = await resProgress.json()

    const attemptsList = Array.isArray(attempts) ? attempts : []
    const partialList = Array.isArray(partialAttempts) ? partialAttempts : []

    console.log("attemptsList:", attemptsList)
    console.log("questionAnalytics:", partialList)


    const totalAttempts = attemptsList.length + partialList.length
    const completionRate =
      totalAttempts > 0 ? Math.round((attemptsList.length / totalAttempts) * 100) : 0

    const getQuizHealthStatus = (rate: number) => {
      if (rate >= 70) return { color: "text-green-500", label: "Excellent" }
      if (rate >= 50) return { color: "text-blue-500", label: "Good" }
      if (rate >= 30) return { color: "text-orange-500", label: "Needs Improvement" }
      return { color: "text-red-500", label: "Poor" }
    }

    const quizHealth = getQuizHealthStatus(completionRate)
    const leadsCount = typeof attempts?.length === 'number' ? attempts.length : 0
    const validLeadsCount = isNaN(leadsCount) ? 0 : Math.round(leadsCount * 0.85)
    const withPhoneCount = isNaN(validLeadsCount) ? 0 : Math.round(validLeadsCount * 0.6)
    const invalidCount = isNaN(leadsCount - validLeadsCount) ? 0 : leadsCount - validLeadsCount
    const questionAnalytics = Array.isArray(analytics?.questionAnalytics) ? analytics.questionAnalytics : []


    return (
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {/* Main content */}
          <div className="w-full">
            <div className="p-6 border-b">
              <Link
                href="/dashboard/quizzes"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Link>
            </div>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Quiz Header */}
              <div id="overview" className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">ID: {id}</span>
                        <span className="mx-2">•</span>
                        <span>Created: {format(new Date(quiz.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/quiz/${id}`} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Quiz
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export Leads
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate Quiz
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden rounded-lg border">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Visitors</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{totalAttempts}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-lg border">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CheckCircle
                              className={`h-6 w-6 ${completionRate > 50 ? "text-green-500" : "text-orange-500"}`}
                            />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{completionRate}%</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-lg border">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Mail className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Leads Collected</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">{leadsCount}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-lg border">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Activity className={`h-6 w-6 ${quizHealth.color}`} />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Quiz Health</dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  <span className={quizHealth.color}>{quizHealth.label}</span>
                                </div>
                                <div className="text-xs text-gray-500">{completionRate}% completion</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funnel Chart */}
              <div id="funnel" className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900">Conversion Funnel</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Track how users progress through your quiz and identify drop-off points.
                  </p>
                  <div className="mt-6 min-h-[320px] w-full overflow-visible">
                    <AnalyticsFunnelChart steps={Array.isArray(analytics.funnelSteps) ? analytics.funnelSteps : []} />
                  </div>
                </div>
              </div>

              {/* Daily Activity */}
              <div id="daily" className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Daily Activity</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Monitor quiz traffic and completion trends over time.
                      </p>
                    </div>
                    <div className="self-start sm:self-center">
                      <AnalyticsDailyChartTabs attempts={attemptsList} partialAttempts={partialList} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two column layout for smaller sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Frequent Answers */}
                <div id="answers" className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Frequent Answers</h2>
                    <p className="mt-1 text-sm text-gray-500">See which options users select most frequently.</p>
                    <div className="mt-6">
                      
                    <AnalyticsFrequentAnswers questionAnalytics={questionAnalytics} />
                    </div>
                  </div>
                </div>

                {/* Result Profiles */}
                <div id="results" className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Result Profiles</h2>
                    <p className="mt-1 text-sm text-gray-500">Distribution of quiz outcomes and result types.</p>
                    <div className="mt-6">
                      <AnalyticsResultProfiles attempts={attemptsList} quiz={quiz} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Leads Collected */}
              <div id="leads" className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Leads Collected</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Contact information collected from quiz participants.
                      </p>
                    </div>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-white overflow-hidden rounded-lg border px-4 py-2 flex items-center">
                        <Mail className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{validLeadsCount}</div>
                          <div className="text-xs text-gray-500">Valid Leads</div>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden rounded-lg border px-4 py-2 flex items-center">
                        <Phone className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{leadsCount - validLeadsCount}</div>
                          <div className="text-xs text-gray-500">With Phone</div>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden rounded-lg border px-4 py-2 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{leadsCount - validLeadsCount}</div>
                          <div className="text-xs text-gray-500">Invalid</div>
                        </div>
                      </div>
                    </div>
                    <AnalyticsLeadsTable attempts={attemptsList} />
                  </div>
                </div>
              </div>

              {/* Diagnostics */}
              <div id="diagnostics" className="bg-white rounded-lg shadow mb-8">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900">Intelligent Diagnostics</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Automated recommendations to improve your quiz performance.
                  </p>
                  <div className="mt-6">
                    <AnalyticsDiagnostics analytics={analytics} quiz={quiz} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    // Criar um componente de erro para exibir ao usuário
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-700 mb-4">
            We encountered an error while loading the analytics data. This might be due to high traffic or temporary
            service limitations.
          </p>
          <p className="text-gray-600 text-sm mb-6">Error details: {error.message || "Unknown error"}</p>
          <div className="flex justify-between">
            <Link href="/dashboard/quizzes" className="text-blue-600 hover:text-blue-800 font-medium">
              Return to Dashboard
            </Link>
            <Link href={`/analytics/${id}`} className="text-blue-600 hover:text-blue-800 font-medium">
              Try Again
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
