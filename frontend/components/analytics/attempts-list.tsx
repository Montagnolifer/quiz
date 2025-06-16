"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type AttemptsListProps = {
  attempts: any[]
  quiz: any
  partialAttempts?: any[]
}

export default function AttemptsList({ attempts, quiz, partialAttempts = [] }: AttemptsListProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null)
  const [isPartialAttempt, setIsPartialAttempt] = useState(false)

  // Combine completed and partial attempts
  const allAttempts = [
    ...attempts.map((attempt) => ({ ...attempt, isCompleted: true })),
    ...partialAttempts.map((attempt) => ({ ...attempt, isCompleted: false })),
  ].sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())

  if (allAttempts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          No attempts recorded yet. Share your quiz to start collecting data.
        </CardContent>
      </Card>
    )
  }

  // Get nodes from quiz flow
  const nodes = quiz.flow_data?.nodes || []

  // Get question nodes
  const questionNodes = nodes.filter(
    (node: any) => node.type === "optionQuestion" || node.type === "imageQuestion" || node.type === "textInput",
  )

  // Get result nodes
  const resultNodes = nodes.filter((node: any) => node.type === "result")

  // Function to get option text by ID or text input value
  const getAnswerText = (nodeId: string, answerId: string) => {
    const node = nodes.find((n: any) => n.id === nodeId)
    if (!node) return "Unknown answer"

    if (node.type === "textInput") {
      return answerId || "No answer provided"
    }

    const option = node.data.options.find((o: any) => o.id === answerId)
    return option ? option.text : "Unknown option"
  }

  // Function to get result title by ID
  const getResultTitle = (resultId: string) => {
    const result = resultNodes.find((n: any) => n.id === resultId)
    return result ? result.data.title : "Unknown result"
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allAttempts.map((attempt) => (
          <TableRow key={attempt.id || attempt.progress_id}>
            <TableCell>
              {new Date(attempt.updated_at || attempt.created_at).toLocaleDateString()}{" "}
              {new Date(attempt.updated_at || attempt.created_at).toLocaleTimeString()}
            </TableCell>
            <TableCell>
              {attempt.isCompleted ? (
                <Badge variant="default">Completed</Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  In Progress
                </Badge>
              )}
            </TableCell>
            <TableCell>{attempt.isCompleted ? "100%" : `${attempt.progress_percentage || 0}%`}</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedAttempt(attempt)
                      setIsPartialAttempt(!attempt.isCompleted)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{isPartialAttempt ? "Partial Attempt Details" : "Attempt Details"}</DialogTitle>
                  </DialogHeader>
                  {selectedAttempt && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <h3 className="font-medium">Date</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedAttempt.updated_at || selectedAttempt.created_at), "PPpp")}
                        </p>
                      </div>

                      {isPartialAttempt && (
                        <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">Incomplete Attempt</p>
                            <p className="text-sm text-amber-700">
                              This user started but didn't complete the quiz. They made it{" "}
                              {selectedAttempt.progress_percentage || 0}% of the way through.
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedAttempt.result_node_id && (
                        <div>
                          <h3 className="font-medium">Result</h3>
                          <p className="text-sm text-muted-foreground">
                            {getResultTitle(selectedAttempt.result_node_id)}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium">Answers</h3>
                        {selectedAttempt.answers && Object.keys(selectedAttempt.answers).length > 0 ? (
                          <div className="space-y-2 mt-2">
                            {questionNodes.map((node: any) => {
                              const answer = isPartialAttempt
                                ? selectedAttempt.answers[node.id]
                                : selectedAttempt.answers?.[node.id]

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
  )
}
