// src/types/dto/create-quiz-progress.dto.ts
export interface CreateQuizProgressDto {
  progress_id: string
  quiz_id: string
  current_node_id: string
  node_history: string[]
  answers: Record<string, string>
  text_inputs: Record<string, string>
  progress_percentage: number
  is_completed: boolean
  result_node_id?: string
}
