import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900">Create Interactive Quizzes with Flow</h1>
        <p className="text-xl text-blue-700">
          Design engaging quizzes with conditional logic, multiple question types, and custom results
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
