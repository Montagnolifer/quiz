import type { FlowData } from "@/lib/database-types"

export type QuizTemplate = {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  thumbnail_url?: string
  flow_data: FlowData
  created_at: string
  creator_id?: string
  is_featured: boolean
  difficulty: "beginner" | "intermediate" | "advanced"
  estimated_time?: string
  likes?: number
  times_used?: number
}

export type TemplateCategory = {
  id: string
  name: string
  description: string
  icon?: string
}
