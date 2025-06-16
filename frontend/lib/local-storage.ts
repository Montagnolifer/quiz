// Local storage utilities for managing data without Supabase
export interface Quiz {
  id: string
  title: string
  description: string
  status: "draft" | "published"
  flow_data: any
  theme_settings: any
  created_at: string
  updated_at: string
  user_id: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id?: string
  result_node_id?: string
  answers: Record<string, any>
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

// Local storage keys
const STORAGE_KEYS = {
  USER: "quiz_app_user",
  QUIZZES: "quiz_app_quizzes",
  ATTEMPTS: "quiz_app_attempts",
  PROGRESS: "quiz_app_progress",
}

// User management
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

// Quiz management
export const getQuizzes = (): Quiz[] => {
  if (typeof window === "undefined") return []
  const quizzes = localStorage.getItem(STORAGE_KEYS.QUIZZES)
  return quizzes ? JSON.parse(quizzes) : []
}

export const saveQuizzes = (quizzes: Quiz[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes))
}

export const getQuizById = (id: string): Quiz | null => {
  const quizzes = getQuizzes()
  return quizzes.find((quiz) => quiz.id === id) || null
}

export const createQuiz = (quizData: Partial<Quiz>): Quiz => {
  const user = getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  const quiz: Quiz = {
    id: generateId(),
    title: quizData.title || "New Quiz",
    description: quizData.description || "",
    status: "draft",
    flow_data: quizData.flow_data || { nodes: [], edges: [] },
    theme_settings: quizData.theme_settings || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: user.id,
  }

  const quizzes = getQuizzes()
  quizzes.push(quiz)
  saveQuizzes(quizzes)

  return quiz
}

export const updateQuiz = (id: string, updates: Partial<Quiz>): Quiz => {
  const quizzes = getQuizzes()
  const index = quizzes.findIndex((quiz) => quiz.id === id)

  if (index === -1) throw new Error("Quiz not found")

  quizzes[index] = {
    ...quizzes[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  saveQuizzes(quizzes)
  return quizzes[index]
}

export const deleteQuiz = (id: string) => {
  const quizzes = getQuizzes()
  const filteredQuizzes = quizzes.filter((quiz) => quiz.id !== id)
  saveQuizzes(filteredQuizzes)
}

// Quiz attempts
export const getQuizAttempts = (): QuizAttempt[] => {
  if (typeof window === "undefined") return []
  const attempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS)
  return attempts ? JSON.parse(attempts) : []
}

export const saveQuizAttempts = (attempts: QuizAttempt[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts))
}

export const createQuizAttempt = (
  quizId: string,
  resultNodeId?: string,
  answers?: Record<string, any>,
): QuizAttempt => {
  const user = getCurrentUser()

  const attempt: QuizAttempt = {
    id: generateId(),
    quiz_id: quizId,
    user_id: user?.id,
    result_node_id: resultNodeId,
    answers: answers || {},
    created_at: new Date().toISOString(),
  }

  const attempts = getQuizAttempts()
  attempts.push(attempt)
  saveQuizAttempts(attempts)

  return attempt
}

// Utility function to generate IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Authentication helpers
export const signIn = async (email: string, password: string): Promise<User> => {
  // Simulate authentication - in a real app, this would validate against a backend
  const user: User = {
    id: generateId(),
    email,
    name: email.split("@")[0], // Use email prefix as name
  }

  setCurrentUser(user)
  return user
}

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate user creation
  const user: User = {
    id: generateId(),
    email,
    name,
  }

  setCurrentUser(user)
  return user
}

export const signOut = async (): Promise<void> => {
  setCurrentUser(null)
}
