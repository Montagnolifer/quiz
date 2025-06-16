import QuizEditor from "@/components/editor/quiz-editor"

export default async function EditorPage({ params }: { params: { id: string } }) {
  const id = params.id; // Garantindo que o Next não reclame
  return <QuizEditor quizId={id} />
}
