"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { createQuiz, updateQuiz, deleteQuiz, publishQuiz, createQuizAttempt } from "@/lib/db-utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Creates a new quiz for the current user
 */
export async function createNewQuiz(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("You must be logged in to create a quiz")
  }

  const title = (formData.get("title") as string) || "New Quiz"
  const description = (formData.get("description") as string) || ""

  const quiz = await createQuiz(session.user.id, { title, description })

  revalidatePath("/dashboard")
  redirect(`/editor/${quiz.id}`)
}

/**
 * Updates an existing quiz
 */
export async function updateExistingQuiz(quizId: string, data: any) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("You must be logged in to update a quiz")
  }

  await updateQuiz(quizId, session.user.id, data)

  revalidatePath(`/dashboard/${quizId}`)
  revalidatePath(`/editor/${quizId}`)
}

/**
 * Publishes a quiz
 */
export async function publishExistingQuiz(quizId: string) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("You must be logged in to publish a quiz")
  }

  await publishQuiz(quizId, session.user.id)

  revalidatePath(`/dashboard/${quizId}`)
  revalidatePath(`/dashboard`)
}

/**
 * Deletes a quiz
 */
export async function deleteExistingQuiz(quizId: string) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("You must be logged in to delete a quiz")
  }

  await deleteQuiz(quizId, session.user.id)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

/**
 * Records a quiz attempt
 */
export async function recordQuizAttempt(
  quizId: string,
  resultNodeId: string | undefined,
  answers: Record<string, any>,
) {
  const supabase = createServerSupabaseClient()

  // Get the current user (optional)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  await createQuizAttempt(quizId, resultNodeId, answers, userId)

  revalidatePath(`/dashboard/${quizId}`)
  revalidatePath(`/analytics/${quizId}`)
}
