import { NextResponse } from "next/server"
import { getQuizAttempts, createQuizAttempt } from "@/lib/db-utils"
import { getCurrentUser, getQuizById } from "@/lib/local-storage"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the quiz belongs to the user
    const quiz = getQuizById(params.id)

    if (!quiz || quiz.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const attempts = await getQuizAttempts(params.id)
    return NextResponse.json({ attempts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = getCurrentUser()

    // Get request body
    const body = await request.json()
    const { resultNodeId, answers } = body

    // Create the attempt
    const attempt = await createQuizAttempt(params.id, resultNodeId, answers, user?.id)

    return NextResponse.json({ attempt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
