'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

async function apiRequest(path: string, options: RequestInit) {
  const token = getToken()
  if (!token) throw new Error('Usuário não autenticado.')

  const res = await fetch(`http://localhost:3005/api${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Erro na requisição')
  }

  return res.json()
}

export async function createNewQuiz(formData: FormData) {
  const title = (formData.get('title') as string) || 'New Quiz'
  const description = (formData.get('description') as string) || ''

  const quiz = await apiRequest('/quizzes', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      status: 'draft',
      flow_data: { nodes: [], edges: [] },
      theme_settings: {},
    }),
  })

  revalidatePath('/dashboard')
  redirect(`/editor/${quiz.id}`)
}

export async function updateExistingQuiz(quizId: string, data: any) {
  await apiRequest(`/quizzes/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  revalidatePath(`/dashboard/${quizId}`)
  revalidatePath(`/editor/${quizId}`)
}

export async function publishExistingQuiz(quizId: string) {
  await apiRequest(`/quizzes/${quizId}/publish`, {
    method: 'PUT',
  })

  revalidatePath(`/dashboard/${quizId}`)
  revalidatePath(`/dashboard`)
}

export async function deleteExistingQuiz(quizId: string) {
  await apiRequest(`/quizzes/${quizId}`, {
    method: 'DELETE',
  })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function recordQuizAttempt(
  quizId: string,
  resultNodeId: string | undefined,
  answers: Record<string, any>,
) {
  await apiRequest(`/quizzes/${quizId}/attempts`, {
    method: 'POST',
    body: JSON.stringify({
      resultNodeId,
      answers,
    }),
  })

  revalidatePath(`/dashboard/${quizId}`)
  revalidatePath(`/analytics/${quizId}`)
}
