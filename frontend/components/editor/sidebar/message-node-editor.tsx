"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Upload, Clock, Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

type MessageNodeEditorProps = {
  nodeId: string
  data: {
    title: string
    description: string
    mediaType: "none" | "image" | "video"
    mediaUrl?: string
    timerDuration?: number
  }
  onSave: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
  onDuplicate?: (nodeId: string, newNodeId: string, data: any) => void
  autoSave?: boolean
}

export default function MessageNodeEditor({
  nodeId,
  data,
  onSave,
  onDelete,
  onDuplicate,
  autoSave = false,
}: MessageNodeEditorProps) {
  const [title, setTitle] = useState(data.title || "")
  const [description, setDescription] = useState(data.description || "")
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">(data.mediaType || "none")
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || "")
  const [useTimer, setUseTimer] = useState(!!data.timerDuration)
  const [timerDuration, setTimerDuration] = useState(data.timerDuration || 5)

  const handleSave = () => {
    onSave(nodeId, {
      ...data,
      title,
      description,
      mediaType,
      mediaUrl: mediaType !== "none" ? mediaUrl : undefined,
      timerDuration: useTimer ? timerDuration : undefined,
    })
  }

  // For now, we'll use placeholder media
  const handleMediaUpload = () => {
    if (mediaType === "image") {
      setMediaUrl(`/placeholder.svg?height=300&width=500&query=image`)
    } else if (mediaType === "video") {
      // This is just a placeholder. In a real app, you'd handle video uploads differently
      setMediaUrl(`https://example.com/video.mp4`)
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      // Create a new node ID
      const newNodeId = uuidv4()
      // Use the onDuplicate function to create a duplicate
      onDuplicate(nodeId, newNodeId, {
        title,
        description,
        mediaType,
        mediaUrl: mediaType !== "none" ? mediaUrl : undefined,
        timerDuration: useTimer ? timerDuration : undefined,
      })
    }
  }

  useEffect(() => {
    if (autoSave) {
      const saveTimeout = setTimeout(() => {
        onSave(nodeId, {
          ...data,
          title,
          description,
          mediaType,
          mediaUrl: mediaType !== "none" ? mediaUrl : undefined,
          timerDuration: useTimer ? timerDuration : undefined,
        })
      }, 500)

      return () => clearTimeout(saveTimeout)
    }
  }, [title, description, mediaType, mediaUrl, useTimer, timerDuration, autoSave, nodeId, data, onSave])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Edit Message</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message-title">Title</Label>
        <Input
          id="message-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter message title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message-description">Description</Label>
        <Textarea
          id="message-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter message description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Media Type</Label>
        <RadioGroup value={mediaType} onValueChange={(value) => setMediaType(value as "none" | "image" | "video")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="media-none" />
            <Label htmlFor="media-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="media-image" />
            <Label htmlFor="media-image">Image</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="media-video" />
            <Label htmlFor="media-video">Video</Label>
          </div>
        </RadioGroup>
      </div>

      {mediaType !== "none" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="media-url">Media URL</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleMediaUpload}>
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          </div>
          <Input
            id="media-url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder={mediaType === "image" ? "Image URL" : "Video URL"}
          />
          {mediaType === "image" && mediaUrl && (
            <div className="mt-2 h-32 bg-gray-100 rounded-md overflow-hidden">
              <img src={mediaUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <Label htmlFor="use-timer">Use Timer</Label>
          </div>
          <Switch id="use-timer" checked={useTimer} onCheckedChange={setUseTimer} />
        </div>

        {useTimer && (
          <div className="space-y-2">
            <Label htmlFor="timer-duration">Timer Duration (seconds before "Next" button appears)</Label>
            <Input
              id="timer-duration"
              type="number"
              min="1"
              max="300"
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number.parseInt(e.target.value) || 5)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="destructive" onClick={() => onDelete(nodeId)}>
          Delete Node
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleDuplicate}>
            <Plus className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          {!autoSave && (
            <Button type="button" onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
