"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type ThemeSettings, defaultTheme } from "@/types/theme"
import { ArrowLeft } from "lucide-react"
import { useCookies } from "react-cookie"
import { v4 as uuidv4 } from "uuid"
import { QuizCardFactory } from "./quiz-card-factory"
import { ResumeCard } from "./cards/resume-card"
import {
  type FlowNode,
  isQuestionNode,
  findMostLikelyPath,
  countQuestionsInPath,
  countAnsweredQuestionsInPath,
  applyMask,
} from "./quiz-utils"
 
// Update the QuizPlayerProps to include theme_settings
type QuizPlayerProps = {
  quizId: string
  initialData?: {
    title: string
    flow_data: any
    theme_settings?: ThemeSettings
  }
}

// In the component, extract theme_settings
export default function QuizPlayer({ quizId, initialData }: QuizPlayerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<any>(initialData)
  const [theme, setTheme] = useState<ThemeSettings>(initialData?.theme_settings || defaultTheme)
  

  // Quiz state
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [currentNode, setCurrentNode] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [resultNode, setResultNode] = useState<any>(null)

  // Add state to track if the quiz attempt has been saved
  const [attemptSaved, setAttemptSaved] = useState(false)

  // Add state to track navigation history
  const [nodeHistory, setNodeHistory] = useState<string[]>([])

  // Add state for the timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Add state for redirect countdown
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)
  const redirectRef = useRef<NodeJS.Timeout | null>(null)

  // Add new state for text input values
  const [textInputs, setTextInputs] = useState<Record<string, string>>({})

  // Add state for progress tracking
  const [progressId, setProgressId] = useState<string | null>(null)
  const [hasExistingProgress, setHasExistingProgress] = useState(false)
  const [cookies, setCookie] = useCookies(["quiz_progress_id"])

  // Add state for saving progress
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add state to track image loading errors
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Add state to track the current path and total questions in the path
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [totalQuestionsInPath, setTotalQuestionsInPath] = useState(0)
  const [answeredQuestionsInPath, setAnsweredQuestionsInPath] = useState(0)

  // Inject custom head code
  useEffect(() => {
    if (theme.customHeadCode) {
      const headScript = document.createElement("script")
      headScript.type = "text/javascript"
      headScript.innerHTML = theme.customHeadCode
      document.head.appendChild(headScript)

      return () => {
        document.head.removeChild(headScript)
      }
    }
  }, [theme.customHeadCode])

  // Inject custom body code
  useEffect(() => {
    if (theme.customBodyCode) {
      const bodyScript = document.createElement("script")
      bodyScript.type = "text/javascript"
      bodyScript.innerHTML = theme.customBodyCode
      document.body.appendChild(bodyScript)

      return () => {
        document.body.removeChild(bodyScript)
      }
    }
  }, [theme.customBodyCode])

  // Check for existing progress
  useEffect(() => {
    let hasChecked = false
  
    const checkExistingProgress = async () => {
      if (hasChecked || !quizId) return
      hasChecked = true
  
      try {
        const cookieProgressId = cookies.quiz_progress_id?.[quizId]
  
        const response = await fetch(`http://localhost:3005/api/quizzes/${quizId}/progress?progressId=${cookieProgressId || ""}`)
        const data = await response.json()
  
        if (data.progress) {
          setHasExistingProgress(true)
          setProgressId(data.progress.progress_id)
          window.quizProgress = data.progress
        } else {
          const newProgressId = uuidv4()
          setProgressId(newProgressId)
          setCookie("quiz_progress_id", {
            ...cookies.quiz_progress_id,
            [quizId]: newProgressId,
          }, { path: "/", maxAge: 60 * 60 * 24 * 30 })
        }
      } catch (error) {
        console.error("Error checking progress:", error)
        const newProgressId = uuidv4()
        setProgressId(newProgressId)
        setCookie("quiz_progress_id", {
          ...cookies.quiz_progress_id,
          [quizId]: newProgressId,
        }, { path: "/", maxAge: 60 * 60 * 24 * 30 })
      }
    }
    
  
    checkExistingProgress()
  }, [quizId])
  

  // Load quiz data if not provided
  useEffect(() => {
    if (initialData) {
      setQuiz(initialData)
      setTheme(initialData.theme_settings || defaultTheme)
      setLoading(false)
    } else {
      const fetchQuiz = async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`http://localhost:3005/api/quizzes/${quizId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.message || "Erro ao carregar quiz")


          if (error) throw error
          if (!data) throw new Error("Quiz not found")

          setQuiz(data)
          setTheme(data.theme_settings || defaultTheme)
        } catch (error: any) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }

      fetchQuiz()
    }
  }, [quizId, initialData])

  // Initialize quiz or resume progress
  useEffect(() => {
    if (quiz && quiz.flow_data) {
      if (hasExistingProgress && window.quizProgress) {
        // Resume from saved progress
        const savedProgress = window.quizProgress

        setCurrentNodeId(savedProgress.current_node_id)
        setNodeHistory(savedProgress.node_history || [])
        setAnswers(savedProgress.answers || {})
        setTextInputs(savedProgress.text_inputs || {})
        setProgress(savedProgress.progress_percentage || 0)

        console.log(`Resuming quiz from node: ${savedProgress.current_node_id}`)
      } else {
        // Initialize new quiz
        const nodes = quiz.flow_data.nodes || []
        const edges = quiz.flow_data.edges || []

        const targetNodeIds = new Set(edges.map((edge: any) => edge.target))

        // Find start nodes (nodes with no incoming edges)
        const startNodes = nodes.filter((node: any) => !targetNodeIds.has(node.id))

        if (startNodes.length > 0) {
          // If multiple start nodes exist, prioritize message nodes as they're typically introductions
          const messageStartNodes = startNodes.filter((node: any) => node.type === "message")
          const selectedStartNode = messageStartNodes.length > 0 ? messageStartNodes[0] : startNodes[0]

          setCurrentNodeId(selectedStartNode.id)
          setNodeHistory([selectedStartNode.id]) // Initialize history with first node

          console.log(`Quiz initialized with start node: ${selectedStartNode.id} (${selectedStartNode.type})`)
        } else if (nodes.length > 0) {
          // Fallback to the first node if no start node is found
          setCurrentNodeId(nodes[0].id)
          setNodeHistory([nodes[0].id]) // Initialize history with first node
          console.log(`No clear start node found, defaulting to first node: ${nodes[0].id}`)
        }
      }
    }
  }, [quiz, hasExistingProgress])

  // Save progress after changes
  useEffect(() => {
    // Don't save if quiz isn't loaded or we're at the start
    if (!quiz || !currentNodeId || !progressId || nodeHistory.length <= 1) return

    // Debounce saving to avoid too many requests
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)

        const progressData = {
          progress_id: progressId,
          quiz_id: quizId,
          current_node_id: currentNodeId,
          node_history: nodeHistory,
          answers,
          text_inputs: textInputs,
          progress_percentage: progress,
          is_completed: false,
          result_node_id: undefined,
        }        

        const response = await fetch(`http://localhost:3005/api/quizzes/${quizId}/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(progressData),
        })

        if (!response.ok) {
          throw new Error("Failed to save progress")
        }

        setLastSaved(new Date())
      } catch (error) {
        console.error("Error saving progress:", error)
      } finally {
        setIsSaving(false)
      }
    }, 1000) // Save after 1 second of inactivity

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [quiz, quizId, currentNodeId, nodeHistory, answers, textInputs, progress, progressId])

  // Update current node and calculate progress when currentNodeId changes
  useEffect(() => {
    if (!quiz || !quiz.flow_data || !currentNodeId) return

    const nodes = quiz.flow_data.nodes || []
    const edges = quiz.flow_data.edges || []
    const node = nodes.find((n: FlowNode) => n.id === currentNodeId)

    setCurrentNode(node)

    // Check if this is a result node
    if (node && node.type === "result") {
      setIsFinished(true)
      setResultNode(node)
      setProgress(100) // Always 100% at result node

      // Save the quiz attempt when reaching a result node
      if (!attemptSaved) {
        handleFinish(node)
      }

      // Handle redirect if enabled
      if (node.data.redirect?.enabled && node.data.redirect?.url) {
        const delay = node.data.redirect.delay || 3
        setRedirectCountdown(delay)

        // Clear any existing redirect timer
        if (redirectRef.current) {
          clearInterval(redirectRef.current)
        }

        // Start countdown
        redirectRef.current = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev === null || prev <= 1) {
              if (redirectRef.current) {
                clearInterval(redirectRef.current)
                // Redirect to the specified URL
                window.location.href = node.data.redirect.url
              }
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } else {
      setIsFinished(false)
      setResultNode(null)

      // Clear any redirect timer
      if (redirectRef.current) {
        clearInterval(redirectRef.current)
        setRedirectCountdown(null)
      }

      // If it's not a question node, clear the selected option
      if (node && node.type !== "optionQuestion" && node.type !== "imageQuestion") {
        setSelectedOption(null)
      } else {
        // For question nodes, restore the previous answer if available
        const previousAnswer = answers[currentNodeId]
        if (previousAnswer) {
          setSelectedOption(previousAnswer)
        } else {
          setSelectedOption(null)
        }
      }

      // Handle timer for message nodes
      if (node && node.type === "message" && node.data.timerDuration) {
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }

        // Set initial time remaining
        setTimeRemaining(node.data.timerDuration)

        // Start the timer
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev === null || prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current)
              }
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        // Clear timer for non-message nodes or message nodes without timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        setTimeRemaining(null)
      }

      // Calculate the most likely path from current node to a result node
      const predictedPath = findMostLikelyPath(nodeHistory, currentNodeId, nodes, edges)
      setCurrentPath(predictedPath)

      // Count total questions in the predicted path
      const totalQuestions = countQuestionsInPath(predictedPath, nodes)
      setTotalQuestionsInPath(totalQuestions)

      // Count answered questions in the path so far
      const answeredQuestions = countAnsweredQuestionsInPath(nodeHistory, answers, nodes)
      setAnsweredQuestionsInPath(answeredQuestions)

      // Calculate progress percentage based on the current path
      // This ensures progress is relative to the current sub-flow
      let progressPercentage = 0

      if (totalQuestions > 0) {
        // Calculate progress based on position in the current path
        const currentQuestionIndex = predictedPath.findIndex((id) => id === currentNodeId)
        const questionsBeforeCurrent = predictedPath.slice(0, currentQuestionIndex + 1).filter((id) => {
          const n = nodes.find((node: FlowNode) => node.id === id)
          return isQuestionNode(n)
        }).length

        // If current node is a question that's been answered, count it
        const isCurrentNodeAnswered = isQuestionNode(node) && answers[currentNodeId] !== undefined

        // Calculate progress based on answered questions and position in path
        if (isCurrentNodeAnswered) {
          // If current question is answered, include it in progress
          progressPercentage = (answeredQuestions / totalQuestions) * 100
        } else if (isQuestionNode(node)) {
          // If current node is an unanswered question, show progress up to but not including it
          progressPercentage = (answeredQuestions / totalQuestions) * 100
        } else {
          // For non-question nodes, show progress based on questions answered so far
          progressPercentage = (answeredQuestions / totalQuestions) * 100
        }
      }

      // Ensure progress is between 0 and 100
      progressPercentage = Math.max(0, Math.min(progressPercentage, 100))

      // Update progress state
      setProgress(progressPercentage)

      console.log(`Progress: ${progressPercentage.toFixed(1)}% (${answeredQuestions}/${totalQuestions} questions)`)
    }
  }, [currentNodeId, quiz, answers, nodeHistory, attemptSaved])

  // Clean up the timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (redirectRef.current) {
        clearInterval(redirectRef.current)
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  // Handle image loading error
  const handleImageError = (optionId: string) => {
    setImageErrors((prev) => ({ ...prev, [optionId]: true }))
  }

  // Add handler for text input changes
  const handleTextInputChange = (value: string) => {
    if (!currentNode) return

    setTextInputs({
      ...textInputs,
      [currentNodeId as string]: value,
    })
  }

  // Handle going back to the previous question
  const handleGoBack = () => {
    if (nodeHistory.length <= 1) return // Can't go back if we're at the first node

    // Remove current node from history
    const newHistory = [...nodeHistory]
    newHistory.pop()

    // Get the previous node
    const previousNodeId = newHistory[newHistory.length - 1]

    // Update state
    setNodeHistory(newHistory)
    setCurrentNodeId(previousNodeId)
  }

  // Handle next button click
  const handleNext = () => {
    // For message nodes, we don't need a selected option
    if (!currentNode) return

    if (currentNode.type === "message") {
      // For message nodes, we don't save an answer
      // Find next node
      const edges = quiz.flow_data.edges || []
      const outgoingEdges = edges.filter((edge: any) => edge.source === currentNodeId)

      if (outgoingEdges.length > 0) {
        const nextNodeId = outgoingEdges[0].target
        // Add to history before changing
        setNodeHistory([...nodeHistory, nextNodeId])
        setCurrentNodeId(nextNodeId)
      } else {
        // No outgoing edges, end the quiz
        setIsFinished(true)
      }
      return
    }

    // For text input nodes
    if (currentNode.type === "textInput") {
      // Check if the field is required and empty
      if (
        currentNode.data.required &&
        (!textInputs[currentNodeId as string] || textInputs[currentNodeId as string].trim() === "")
      ) {
        return // Don't proceed if required field is empty
      }

      // Save answer
      setAnswers({
        ...answers,
        [currentNodeId as string]: textInputs[currentNodeId as string] || "",
      })

      // Find next node
      const edges = quiz.flow_data.edges || []
      const outgoingEdges = edges.filter((edge: any) => edge.source === currentNodeId)

      if (outgoingEdges.length > 0) {
        const nextNodeId = outgoingEdges[0].target
        // Add to history before changing
        setNodeHistory([...nodeHistory, nextNodeId])
        setCurrentNodeId(nextNodeId)
      } else {
        // No outgoing edges, end the quiz
        setIsFinished(true)
      }
      return
    }

    // For question nodes, we need a selected option
    if (!selectedOption) return

    // Save answer
    setAnswers({
      ...answers,
      [currentNodeId as string]: selectedOption,
    })

    // Find next node
    const edges = quiz.flow_data.edges || []
    const nodes = quiz.flow_data.nodes || []

    // Check if there's a condition node connected to this node
    const outgoingEdges = edges.filter((edge: any) => edge.source === currentNodeId)

    if (outgoingEdges.length > 0) {
      const nextNodeId = outgoingEdges[0].target
      const nextNode = nodes.find((node: any) => node.id === nextNodeId)

      // If next node is a condition, evaluate it
      if (nextNode && nextNode.type === "condition") {
        const conditions = nextNode.data.conditions || []

        // Find matching condition
        const matchingCondition = conditions.find(
          (condition: any) => condition.sourceId === currentNodeId && condition.optionId === selectedOption,
        )

        if (matchingCondition) {
          // Follow the condition path
          const targetNodeId = matchingCondition.targetId
          // Add to history before changing
          setNodeHistory([...nodeHistory, targetNodeId])
          setCurrentNodeId(targetNodeId)
        } else {
          // If no matching condition, try to find a default path
          const defaultEdge = edges.find((edge: any) => edge.source === nextNodeId)
          if (defaultEdge) {
            const targetNodeId = defaultEdge.target
            // Add to history before changing
            setNodeHistory([...nodeHistory, targetNodeId])
            setCurrentNodeId(targetNodeId)
          } else {
            // No path found, end the quiz
            setIsFinished(true)
          }
        }
      } else {
        // Move to the next node directly
        const targetNodeId = nextNodeId
        // Add to history before changing
        setNodeHistory([...nodeHistory, targetNodeId])
        setCurrentNodeId(targetNodeId)
      }
    } else {
      // No outgoing edges, end the quiz
      setIsFinished(true)
    }
  }

  // Handle quiz completion
  const handleFinish = async (resultNodeData: any = null) => {
    try {
      console.log("Saving quiz attempt...")

      // Use the passed result node or the current result node
      const currentResultNode = resultNodeData || resultNode

      // Mark progress as completed
      if (progressId) {
        console.log("Marking progress as completed with ID:", progressId)
        await fetch(`http://localhost:3005/api/quizzes/${quizId}/progress`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            progress_id: progressId, // 👈 certifique-se de usar progress_id (não progressId com camelCase no back)
            result_node_id: currentResultNode?.id,
          }),
        })
      }

      // Save quiz attempt with only the fields that exist in the schema
      console.log("Inserting quiz attempt with answers:", answers)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3005/api/quizzes/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quizId,
          result_node_id: currentResultNode?.id,
          answers,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Erro ao salvar tentativa")


      if (error) {
        console.error("Error saving quiz attempt:", error)
        throw error
      }

      console.log("Quiz attempt saved successfully:", data)
      setAttemptSaved(true)
    } catch (error: any) {
      console.error("Error in handleFinish:", error)
      setError(error.message)
    }
  }

  // Handle external link button click
  const handleButtonClick = (url: string) => {
    window.open(url, "_blank")
  }

  // Handle starting a new attempt
  const handleStartNew = () => {
    // Reset the attempt saved flag
    setAttemptSaved(false)

    // Generate new progress ID
    const newProgressId = uuidv4()
    setProgressId(newProgressId)

    // Reset all state
    setAnswers({})
    setTextInputs({})
    setSelectedOption(null)
    setProgress(0)
    setIsFinished(false)
    setResultNode(null)
    setImageErrors({})
    setCurrentPath([])
    setTotalQuestionsInPath(0)
    setAnsweredQuestionsInPath(0)

    // Initialize quiz from beginning
    const nodes = quiz.flow_data.nodes || []
    const edges = quiz.flow_data.edges || []
    const targetNodeIds = new Set(edges.map((edge: any) => edge.target))
    const startNodes = nodes.filter((node: any) => !targetNodeIds.has(node.id))

    if (startNodes.length > 0) {
      const messageStartNodes = startNodes.filter((node: any) => node.type === "message")
      const selectedStartNode = messageStartNodes.length > 0 ? messageStartNodes[0] : startNodes[0]

      setCurrentNodeId(selectedStartNode.id)
      setNodeHistory([selectedStartNode.id])
    } else if (nodes.length > 0) {
      setCurrentNodeId(nodes[0].id)
      setNodeHistory([nodes[0].id])
    }

    // Save to cookie
    setCookie(
      "quiz_progress_id",
      {
        ...cookies.quiz_progress_id,
        [quizId]: newProgressId,
      },
      { path: "/", maxAge: 60 * 60 * 24 * 30 },
    ) // 30 days

    setHasExistingProgress(false)
  }

  // Handle resuming a quiz
  const handleResume = () => {
    if (window.quizProgress && window.quizProgress.current_node_id) {
      setCurrentNodeId(window.quizProgress.current_node_id)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!quiz || !quiz.flow_data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Quiz not found or not published</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show resume prompt if there's existing progress
  if (hasExistingProgress && window.quizProgress && !currentNodeId) {
    return (
      <ResumeCard
        theme={theme}
        progress={window.quizProgress.progress_percentage || 0}
        onResume={handleResume}
        onStartNew={handleStartNew}
      />
    )
  }

  // Update the return statement to use the theme
  return (
    <>
      {theme.customHeadCode && <div dangerouslySetInnerHTML={{ __html: theme.customHeadCode }} />}
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily,
          color: theme.textColor,
        }}
      >
        <div className="w-full max-w-md">
          {/* Back button and Progress bar */}
          <div className="mb-4">
            {/* Only show back button if we're not at the first question and not finished */}
            {nodeHistory.length > 1 && !isFinished && (
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 pl-0"
                onClick={handleGoBack}
                style={{ color: theme.headerColor }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to previous question
              </Button>
            )}

            {/* Progress bar */}
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: `${theme.buttonColor}30` }}>
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: theme.buttonColor,
                }}
              ></div>
              <div style={{ color: theme.headerColor, fontSize: "0.75rem", marginTop: "0.25rem" }}>
                {Math.min(Math.round(progress), 100)}%
                {lastSaved && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {isSaving ? "Saving..." : `Last saved: ${lastSaved.toLocaleTimeString()}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Card
            className="w-full"
            style={{
              backgroundColor: theme.cardColor,
              borderRadius: `${theme.borderRadius}rem`,
            }}
          >
            <CardContent className="p-6">
              <QuizCardFactory
                node={isFinished ? resultNode : currentNode}
                selectedOption={selectedOption}
                textInputs={textInputs}
                currentNodeId={currentNodeId || ""}
                timeRemaining={timeRemaining}
                imageErrors={imageErrors}
                redirectCountdown={redirectCountdown}
                theme={theme}
                onOptionSelect={handleOptionSelect}
                onTextInputChange={handleTextInputChange}
                onNext={handleNext}
                onImageError={handleImageError}
                onButtonClick={handleButtonClick}
                onStartNew={handleStartNew}
                applyMask={applyMask}
              />
            </CardContent>
          </Card>
        </div>
        {theme.customBodyCode && <div dangerouslySetInnerHTML={{ __html: theme.customBodyCode }} />}
      </div>
    </>
  )
}

// Add this to the global window object
declare global {
  interface Window {
    quizProgress: any
  }
}
