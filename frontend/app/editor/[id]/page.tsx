import QuizEditor from "@/components/editor/quiz-editor"

export default function EditorPage({ params }: { params: { id: string } }) {
  return <QuizEditor quizId={params.id} />
}
