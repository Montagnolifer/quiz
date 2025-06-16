"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import QuizPlayer from "@/components/quiz/quiz-player"

export default function QuizPage() {
  const { id } = useParams() as { id: string }
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return // espera o id estar disponível

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:3005/quizzes/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Erro ao buscar quiz")
        setQuiz(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  if (loading) return <div>Carregando quiz...</div>
  if (error || !quiz) return <div>Erro: {error || "Quiz não encontrado"}</div>

  return <QuizPlayer quizId={id} initialData={quiz} />
}
