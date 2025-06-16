import { NextResponse } from "next/server"
import { getQuizzes, createQuiz } from "@/lib/db-utils"
import { getCurrentUser } from "@/lib/local-storage"

export async function GET() {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quizzes = await getQuizzes(user.id)
    return NextResponse.json({ quizzes })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const quiz = await createQuiz(user.id, body)

    return NextResponse.json({ quiz })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
