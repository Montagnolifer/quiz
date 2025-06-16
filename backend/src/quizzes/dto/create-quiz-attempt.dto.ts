// src/quizzes/dto/create-quiz-attempt.dto.ts
export class CreateQuizAttemptDto {
    quiz_id: string
    result_node_id: string
    answers: Record<string, string>
  }