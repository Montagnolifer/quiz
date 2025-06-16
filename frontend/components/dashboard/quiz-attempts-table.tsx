"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye } from "lucide-react"
import type { QuizAttempt, Quiz } from "@/lib/database-types"

type QuizAttemptsTableProps = {
  quizId: string
}

export default function QuizAttemptsTable({ quizId }: QuizAttemptsTableProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quiz data
        const quizResponse = await fetch(`/api/quizzes/${quizId}`)
        if (!quizResponse.ok) {
          throw new Error("Failed to fetch quiz")
        }
        const quizData = await quizResponse.json()
        setQuiz(quizData.quiz)

        // Fetch attempts
        const attemptsResponse = await fetch(`/api/quizzes/${quizId}/attempts`)
        if (!attemptsResponse.ok) {
          throw new Error("Failed to fetch attempts")
        }
        const attemptsData = await attemptsResponse.json()
        setAttempts(attemptsData.attempts || [])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [quizId])

  // Function to get option text by ID
  const getAnswerText = (nodeId: string, answerId: string) => {
    if (!quiz) return "Unknown answer"

    const node = quiz.flow_data.nodes.find((n) => n.id === nodeId)
    if (!node) return "Unknown answer"

    if (node.type === "textInput") {
      return answerId || "No answer provided"
    }

    const option = node.data.options?.find((o: any) => o.id === answerId)
    return option ? option.text : "Unknown option"
  }

  // Function to get result title by ID
  const getResultTitle = (resultId: string) => {
    if (!quiz) return "Unknown result"

    const resultNodes = quiz.flow_data.nodes.filter((n) => n.type === "result")
    const result = resultNodes.find((n) => n.id === resultId)
    return result ? result.data.title : "Unknown result"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Error loading attempts: {error}</p>
  }

  if (attempts.length === 0) {
    return <p className="text-muted-foreground py-4">No attempts recorded yet.</p>
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Recent Attempts</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.slice(0, 5).map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell>{format(new Date(attempt.created_at), "MMM d, yyyy h:mm a")}</TableCell>
              <TableCell>{attempt.result_node_id ? getResultTitle(attempt.result_node_id) : "Incomplete"}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedAttempt(attempt)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Attempt Details</DialogTitle>
                    </DialogHeader>
                    {selectedAttempt && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <h3 className="font-medium">Date</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(selectedAttempt.created_at), "PPpp")}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Result</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedAttempt.result_node_id
                              ? getResultTitle(selectedAttempt.result_node_id)
                              : "Incomplete"}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium">Answers</h3>
                          {selectedAttempt.answers && Object.keys(selectedAttempt.answers).length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {quiz?.flow_data.nodes
                                .filter((node) => ["optionQuestion", "imageQuestion", "textInput"].includes(node.type))
                                .map((node) => {
                                  const answer = selectedAttempt.answers?.[node.id]
                                  if (!answer) return null

                                  return (
                                    <div key={node.id} className="border rounded-md p-3">
                                      <p className="font-medium text-sm">{node.data.title}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Answer: {getAnswerText(node.id, answer)}
                                      </p>
                                    </div>
                                  )
                                })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No answers recorded</p>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
