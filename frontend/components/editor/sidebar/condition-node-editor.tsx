"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash, Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

type ConditionNodeEditorProps = {
  nodeId: string
  data: {
    title: string
    conditions: { id: string; sourceId: string; optionId: string; targetId: string }[]
  }
  nodes: any[]
  edges: any[] // Adicionar edges para verificar conexões
  onSave: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
  onDuplicate?: (nodeId: string, newNodeId: string, data: any) => void
  autoSave?: boolean
}

export default function ConditionNodeEditor({
  nodeId,
  data,
  nodes,
  edges,
  onSave,
  onDelete,
  onDuplicate,
  autoSave = false,
}: ConditionNodeEditorProps) {
  const [title, setTitle] = useState(data.title || "")
  const [conditions, setConditions] = useState(data.conditions || [])

  // Encontrar nós conectados ao nó de condição atual
  const incomingNodeIds = edges.filter((edge) => edge.target === nodeId).map((edge) => edge.source)

  const outgoingNodeIds = edges.filter((edge) => edge.source === nodeId).map((edge) => edge.target)

  // Filtrar nós de questão que estão conectados como entrada (source)
  const connectedQuestionNodes = nodes.filter(
    (node) =>
      incomingNodeIds.includes(node.id) &&
      (node.type === "optionQuestion" || node.type === "imageQuestion" || node.type === "textInput"),
  )

  // Se não houver nós conectados, mostrar todos os nós de questão como fallback
  const questionNodes =
    connectedQuestionNodes.length > 0
      ? connectedQuestionNodes
      : nodes.filter(
          (node) => node.type === "optionQuestion" || node.type === "imageQuestion" || node.type === "textInput",
        )

  // Filtrar nós de destino que estão conectados como saída (target)
  const connectedTargetNodes = nodes.filter(
    (node) =>
      outgoingNodeIds.includes(node.id) &&
      node.id !== nodeId &&
      (node.type === "optionQuestion" ||
        node.type === "imageQuestion" ||
        node.type === "textInput" ||
        node.type === "result" ||
        node.type === "message"),
  )

  // Se não houver nós conectados, mostrar todos os nós possíveis como destino
  const targetNodes =
    connectedTargetNodes.length > 0
      ? connectedTargetNodes
      : nodes.filter(
          (node) =>
            node.id !== nodeId &&
            (node.type === "optionQuestion" ||
              node.type === "imageQuestion" ||
              node.type === "textInput" ||
              node.type === "result" ||
              node.type === "message"),
        )

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      {
        id: uuidv4(),
        sourceId: questionNodes[0]?.id || "",
        optionId: "",
        targetId: "",
      },
    ])
  }

  const handleConditionChange = (id: string, field: string, value: string) => {
    setConditions(conditions.map((condition) => (condition.id === id ? { ...condition, [field]: value } : condition)))
  }

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id))
  }

  const handleSave = () => {
    onSave(nodeId, {
      ...data,
      title,
      conditions,
    })
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      // Create a new node ID
      const newNodeId = uuidv4()
      // Use the onDuplicate function to create a duplicate
      onDuplicate(nodeId, newNodeId, {
        title,
        conditions: [...conditions],
      })
    }
  }

  useEffect(() => {
    if (autoSave) {
      const saveTimeout = setTimeout(() => {
        onSave(nodeId, {
          ...data,
          title,
          conditions,
        })
      }, 500)

      return () => clearTimeout(saveTimeout)
    }
  }, [title, conditions, autoSave, nodeId, data, onSave])

  // Get options for a selected source node
  const getOptionsForSource = (sourceId: string) => {
    const sourceNode = nodes.find((node) => node.id === sourceId)
    return sourceNode?.data?.options || []
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Edit Condition Node</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition-title">Condition Title</Label>
        <Input
          id="condition-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter condition title"
        />
      </div>

      <div className="space-y-2">
        <Label>Conditions</Label>
        <div className="space-y-4">
          {conditions.map((condition) => (
            <div key={condition.id} className="space-y-2 p-3 border rounded-md">
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCondition(condition.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>If answer from</Label>
                <Select
                  value={condition.sourceId}
                  onValueChange={(value) => handleConditionChange(condition.id, "sourceId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionNodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data.title || `Question ${node.id.slice(0, 4)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Is option</Label>
                <Select
                  value={condition.optionId}
                  onValueChange={(value) => handleConditionChange(condition.id, "optionId", value)}
                  disabled={!condition.sourceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOptionsForSource(condition.sourceId).map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.text || `Option ${option.id.slice(0, 4)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Go to</Label>
                <Select
                  value={condition.targetId}
                  onValueChange={(value) => handleConditionChange(condition.id, "targetId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetNodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.data.title || `Node ${node.id.slice(0, 4)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={handleAddCondition} className="w-full">
          Add Condition
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
