"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Trash, Palette, BarChart } from "lucide-react"

type QuizCardProps = {
  id: string
  title: string
  description?: string
  status: "draft" | "published"
  onPublish: (id: string) => void
  onDelete: (id: string) => void
}

export default function QuizCard({ id, title, description, status, onPublish, onDelete }: QuizCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={status === "published" ? "default" : "outline"}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">{/* Quiz stats could go here in the future */}</CardContent>
      <CardFooter className="flex flex-wrap gap-1 items-center">
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href={`/editor/${id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href={`/customize/${id}`}>
            <Palette className="mr-2 h-4 w-4" />
            Customize
          </Link>
        </Button>
        {status === "published" && (
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href={`/analytics/${id}`}>
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
        )}
        {status === "draft" ? (
          <Button size="sm" className="rounded-full" onClick={() => onPublish(id)}>
            Publish
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href={`/quiz/${id}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
        )}
        <Button variant="destructive" size="sm" className="rounded-full" onClick={() => onDelete(id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
