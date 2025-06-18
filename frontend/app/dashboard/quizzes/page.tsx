"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import QuizCard from "@/components/dashboard/quiz-card"
import RequireToken from "@/hooks/require-token" 

export default function QuizzesPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulando carregamento de quizzes locais (pode conectar com backend depois)
  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Token não encontrado.")
        setLoading(false)
        return
      }
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Erro ao carregar quizzes")
  
        setQuizzes(data)
      } catch (error: any) {
        setError(error.message || "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }
  
    fetchQuizzes()
  }, [])
  

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Usuário não autenticado.")
      return
    }
  
    setLoading(true)
    setError(null)
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Novo Quiz",
          description: "",
          status: "draft",
          flow_data: { nodes: [], edges: [] },
          theme_settings: {},
        }),
      })
  
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.message || "Erro ao criar o quiz")
  
      router.push(`/editor/${data.id}`)
    } catch (error: any) {
      setError(error.message || "Erro inesperado")
    } finally {
      setLoading(false)
    }
  }  

  const handlePublishQuiz = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Usuário não autenticado.')
      return
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/publish`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao publicar o quiz')
      }
  
      // Atualiza localmente
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'published' } : q))
      )
    } catch (error: any) {
      setError(error.message || 'Erro inesperado ao publicar')
    }
  }  

  const handleDeleteQuiz = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Usuário não autenticado.')
      return
    }
  
    if (!confirm('Tem certeza que deseja deletar esse quiz?')) {
      return
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao deletar o quiz')
      }
  
      // Remove localmente
      setQuizzes((prev) => prev.filter((q) => q.id !== id))
    } catch (error: any) {
      setError(error.message || 'Erro inesperado ao deletar')
    }
  }
  

  if (loading) {
    return <div className="text-center py-8">Loading your quizzes...</div>
  }

  return (
    <RequireToken>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col w-full">
          <DashboardHeader />

          <div className="flex flex-1 w-full">
            <SidebarNav />

            <SidebarInset className="w-full">
              <main className="flex-1 p-6 w-full space-y-8">
                <div className="container py-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Quizzes</h2>
                    <Button onClick={handleCreateQuiz}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Quiz
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {quizzes.length === 0 ? (
                    <div className="text-center py-12 bg-muted rounded-xl">
                      <h3 className="text-xl font-medium mb-2">No quizzes yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
                      <Button onClick={handleCreateQuiz}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quizzes.map((quiz) => (
                        <QuizCard
                          key={quiz.id}
                          id={quiz.id}
                          title={quiz.title}
                          description={quiz.description}
                          status={quiz.status}
                          onPublish={handlePublishQuiz}
                          onDelete={handleDeleteQuiz}
                        />
                      ))}

                    </div>
                  )}

                  <Button
                    size="lg"
                    className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg"
                    onClick={handleCreateQuiz}
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span className="sr-only">Create New Quiz</span>
                  </Button>
                </div>
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </RequireToken>
  )
}
