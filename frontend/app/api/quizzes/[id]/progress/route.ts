import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/local-storage"

const progressStorage = new Map()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await context.params
    const user = getCurrentUser()

    const url = new URL(request.url)
    const progressId = url.searchParams.get("progressId")

    let progress = null

    if (user) {
      progress = progressStorage.get(`${quizId}_${user.id}`)
    } else if (progressId) {
      progress = progressStorage.get(progressId)
    }

    return NextResponse.json({ progress })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await context.params
    const user = getCurrentUser()

    const body = await request.json()
    const { progressId, currentNodeId, nodeHistory, answers, textInputs, progress } = body

    const progressData = {
      quiz_id: quizId,
      user_id: user?.id || null,
      progress_id: progressId || `progress_${Date.now()}_${Math.random()}`,
      current_node_id: currentNodeId,
      node_history: nodeHistory,
      answers,
      text_inputs: textInputs,
      progress_percentage: progress,
      is_completed: false,
      updated_at: new Date().toISOString(),
    }

    const key = user ? `${quizId}_${user.id}` : progressData.progress_id
    progressStorage.set(key, progressData)

    return NextResponse.json({ progress: progressData })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await context.params

    const body = await request.json()
    const { progressId, resultNodeId } = body

    if (!progressId) {
      return NextResponse.json({ error: "Progress ID is required" }, { status: 400 })
    }

    const progress = progressStorage.get(progressId)
    if (progress) {
      progress.is_completed = true
      progress.result_node_id = resultNodeId
      progress.updated_at = new Date().toISOString()

      progressStorage.set(progressId, progress)
    }

    return NextResponse.json({ progress })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
