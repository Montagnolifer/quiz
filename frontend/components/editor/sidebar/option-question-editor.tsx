"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash, Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Textarea } from "@/components/ui/textarea"

type OptionQuestionEditorProps = {
  nodeId: string
  data: {
    title: string
    description?: string
    options: { id: string; text: string }[]
  }
  onSave: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
  onDuplicate?: (nodeId: string, newNodeId: string, data: any) => void
  autoSave?: boolean
}

export default function OptionQuestionEditor({
  nodeId,
  data,
  onSave,
  onDelete,
  onDuplicate,
  autoSave = false,
}: OptionQuestionEditorProps) {
  const [title, setTitle] = useState(data.title || "")
  const [description, setDescription] = useState(data.description || "")
  const [options, setOptions] = useState(data.options || [])

  const handleAddOption = () => {
    setOptions([...options, { id: uuidv4(), text: "" }])
  }

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id))
  }

  const handleSave = () => {
    onSave(nodeId, {
      ...data,
      title,
      description,
      options,
    })
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      // Create a new node ID
      const newNodeId = uuidv4()
      // Use the onDuplicate function to create a duplicate
      onDuplicate(nodeId, newNodeId, {
        title,
        description,
        options: [...options],
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
          options,
        })
      }, 500)

      return () => clearTimeout(saveTimeout)
    }
  }, [title, description, options, autoSave, nodeId, data, onSave])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Edit Options Question</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="question-title">Question Text</Label>
        <Input
          id="question-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your question"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question-description">Description</Label>
        <Textarea
          id="question-description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter additional details or instructions (optional)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <Input
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder="Option text"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={handleAddOption} className="w-full">
          Add Option
        </Button>
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
