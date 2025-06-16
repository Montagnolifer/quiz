"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

type TextInputEditorProps = {
  nodeId: string
  data: {
    title: string
    placeholder?: string
    required?: boolean
    fieldType: "text" | "email" | "number" | "phone" | "textarea"
    validation?: {
      minLength?: number
      maxLength?: number
      pattern?: string
    }
    description?: string
    mask?: string
  }
  onSave: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
  onDuplicate?: (nodeId: string, newNodeId: string, data: any) => void
  autoSave?: boolean
}

export default function TextInputEditor({
  nodeId,
  data,
  onSave,
  onDelete,
  onDuplicate,
  autoSave = false,
}: TextInputEditorProps) {
  const [title, setTitle] = useState(data.title || "")
  const [description, setDescription] = useState(data.description || "")
  const [placeholder, setPlaceholder] = useState(data.placeholder || "")
  const [required, setRequired] = useState(data.required || false)
  const [fieldType, setFieldType] = useState(data.fieldType || "text")
  const [validation, setValidation] = useState(data.validation || {})
  const [mask, setMask] = useState(data.mask || "")

  const handleSave = () => {
    onSave(nodeId, {
      ...data,
      title,
      description,
      placeholder,
      required,
      fieldType,
      validation,
      mask,
    })
  }

  const handleValidationChange = (key: string, value: any) => {
    setValidation({
      ...validation,
      [key]: value,
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
        placeholder,
        required,
        fieldType,
        validation,
        mask,
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
          placeholder,
          required,
          fieldType,
          validation,
          mask,
        })
      }, 500)

      return () => clearTimeout(saveTimeout)
    }
  }, [title, description, placeholder, required, fieldType, validation, mask, autoSave, nodeId, data, onSave])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Edit Text Input</h3>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-title">Question Text</Label>
            <Input
              id="input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your question"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-description">Description</Label>
            <Textarea
              id="input-description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter additional details or instructions (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-placeholder">Placeholder Text</Label>
            <Input
              id="input-placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Field Type</Label>
            <Select value={fieldType} onValueChange={(value: any) => setFieldType(value)}>
              <SelectTrigger id="field-type">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required-field">Required Field</Label>
            <Switch id="required-field" checked={required} onCheckedChange={setRequired} />
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="min-length">Minimum Length</Label>
            <Input
              id="min-length"
              type="number"
              value={validation.minLength || ""}
              onChange={(e) => handleValidationChange("minLength", Number.parseInt(e.target.value) || undefined)}
              placeholder="Minimum characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-length">Maximum Length</Label>
            <Input
              id="max-length"
              type="number"
              value={validation.maxLength || ""}
              onChange={(e) => handleValidationChange("maxLength", Number.parseInt(e.target.value) || undefined)}
              placeholder="Maximum characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattern">Validation Pattern (RegEx)</Label>
            <Input
              id="pattern"
              value={validation.pattern || ""}
              onChange={(e) => handleValidationChange("pattern", e.target.value || undefined)}
              placeholder="Regular expression pattern"
            />
            <p className="text-xs text-muted-foreground">
              Enter a regular expression to validate the input (e.g., ^[A-Za-z]+$ for letters only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-mask">Máscara de Entrada</Label>
            <Input
              id="input-mask"
              value={mask}
              onChange={(e) => setMask(e.target.value)}
              placeholder="Ex: (00) 00000-0000, 00000-000, R$ 0.000,00"
            />
            <p className="text-xs text-muted-foreground">
              Use 0 para dígitos. Exemplos: (00) 00000-0000 para WhatsApp, 00000-000 para CEP, R$ 0.000,00 para moeda
            </p>
          </div>
        </TabsContent>
      </Tabs>

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
