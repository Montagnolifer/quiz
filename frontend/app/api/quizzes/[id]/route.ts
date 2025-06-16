import { NextResponse } from "next/server"
import { getQuizById, updateQuiz, deleteQuiz } from "@/lib/db-utils"
import { getCurrentUser } from "@/lib/local-storage"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = getCurrentUser()

    // Get quiz - if user is logged in, check ownership; otherwise only get published
    let quiz
    if (user) {
      quiz = await getQuizById(params.id, user.id)
      if (!quiz) {
        // If not found as owner, try to get it as a published quiz
        quiz = await getQuizById(params.id)
        if (quiz && quiz.status !== "published") {
          return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
        }
      }
    } else {
      // Not logged in, only get published quizzes
      quiz = await getQuizById(params.id)
      if (!quiz || quiz.status !== "published") {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ quiz })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const quiz = await updateQuiz(params.id, user.id, body)

    return NextResponse.json({ quiz })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteQuiz(params.id, user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
