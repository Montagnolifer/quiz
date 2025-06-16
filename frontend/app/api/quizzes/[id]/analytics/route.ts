import { NextResponse } from "next/server"
import { getQuizAnalytics } from "@/lib/db-utils"
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

    const analytics = await getQuizAnalytics(params.id)
    return NextResponse.json({ analytics })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}