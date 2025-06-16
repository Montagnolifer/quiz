"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

// Sample announcements - in a real app, these would come from an API
const announcements = [
  {
    title: "Welcome to QuizApp",
    description: "Create, share, and analyze interactive quizzes with ease.",
    color: "bg-blue-500",
  },
  {
    title: "New Feature: Advanced Analytics",
    description: "Gain deeper insights into quiz performance with our new analytics tools.",
    color: "bg-purple-500",
  },
  {
    title: "Tips & Tricks",
    description: "Use conditional logic to create personalized quiz experiences.",
    color: "bg-green-500",
  },
]

export function DynamicBanner() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.name?.split(" ")[0] || "there"
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate announcements every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const currentAnnouncement = announcements[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${currentAnnouncement.color} text-white p-6 shadow-md transition-all duration-500 ease-in-out`}
    >
      <div className="flex flex-col space-y-2 max-w-3xl">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">Hey {firstName}!</h1>
          <div className="flex items-center space-x-1 text-xs bg-white/20 rounded-full px-2 py-1">
            <span className="animate-pulse rounded-full bg-white h-2 w-2"></span>
            <span>New</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold">{currentAnnouncement.title}</h2>
        <p className="text-white/90">{currentAnnouncement.description}</p>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {announcements.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Announcement ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous announcement</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
        onClick={handleNext}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next announcement</span>
      </Button>

      <div className="absolute right-4 top-4 h-32 w-32 rounded-full bg-white/10 opacity-50" />
      <div className="absolute right-12 top-12 h-16 w-16 rounded-full bg-white/20 opacity-50" />
    </div>
  )
}
