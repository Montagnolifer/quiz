"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  type Connection,
  type Node,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Save,
  ArrowLeft,
  MessageSquare,
  ImageIcon,
  GitBranch,
  CheckCircle,
  TextIcon as TextFields,
  Trash,
  Loader2,
  Check,
} from "lucide-react"

// Import node types
import OptionQuestionNode from "./node-types/option-question-node"
import ImageQuestionNode from "./node-types/image-question-node"
import ConditionNode from "./node-types/condition-node"
import ResultNode from "./node-types/result-node"
// Import the new message node type
import MessageNode from "./node-types/message-node"
import TextInputNode from "./node-types/text-input-node"

// Import node editors
import OptionQuestionEditor from "./sidebar/option-question-editor"
import ImageQuestionEditor from "./sidebar/image-question-editor"
import ConditionNodeEditor from "./sidebar/condition-node-editor"
import ResultNodeEditor from "./sidebar/result-node-editor"
import MessageNodeEditor from "./sidebar/message-node-editor"
import TextInputEditor from "./sidebar/text-input-editor"

// Define node types
const nodeTypes: NodeTypes = {
  optionQuestion: OptionQuestionNode,
  imageQuestion: ImageQuestionNode,
  condition: ConditionNode,
  result: ResultNode,
  message: MessageNode,
  textInput: TextInputNode,
}

type QuizEditorProps = {
  quizId: string
  initialData?: {
    title: string
    description?: string
    flow_data?: any
  }
}

export default function QuizEditor({ quizId, initialData }: QuizEditorProps) {
  const { user } = useAuth()
  const router = useRouter()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Quiz metadata
  const [title, setTitle] = useState(initialData?.title || "New Quiz")
  const [description, setDescription] = useState(initialData?.description || "")

  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.flow_data?.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.flow_data?.edges || [])

  // UI state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    async function fetchQuiz() {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Usuário não autenticado")
        return
      }
  
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const res = await fetch(`${apiUrl}/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) {
        setError("Erro ao carregar quiz")
        return
      }
  
      const data = await res.json()
      setTitle(data.title)
      setDescription(data.description)
      setNodes(data.flow_data?.nodes || [])
      setEdges(data.flow_data?.edges || [])
    }
  
    fetchQuiz()
  }, [quizId])
  

  // Load selected node when nodes change
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find((node) => node.id === selectedNode.id)
      if (updatedNode) {
        setSelectedNode(updatedNode)
      } else {
        setSelectedNode(null)
      }
    }
  }, [nodes, selectedNode])

  // Handle connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: any) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }, [])

  // Handle background click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  // Add a new node
  const addNode = useCallback(
    (type: string) => {
      const newNode = {
        id: uuidv4(),
        type,
        position: {
          x: reactFlowInstance?.project({ x: window.innerWidth / 2, y: window.innerHeight / 3 }).x || 250,
          y: reactFlowInstance?.project({ x: window.innerWidth / 2, y: window.innerHeight / 3 }).y || 100,
        },
        data: {
          title:
            type === "optionQuestion"
              ? "New Options Question"
              : type === "imageQuestion"
                ? "New Image Question"
                : type === "condition"
                  ? "New Condition"
                  : type === "message"
                    ? "New Message"
                    : type === "textInput"
                      ? "New Text Input"
                      : "New Result",
          options:
            type === "optionQuestion"
              ? [
                  { id: uuidv4(), text: "Option 1" },
                  { id: uuidv4(), text: "Option 2" },
                ]
              : type === "imageQuestion"
                ? [
                    { id: uuidv4(), text: "Option 1" },
                    { id: uuidv4(), text: "Option 2" },
                  ]
                : [],
          conditions: type === "condition" ? [] : undefined,
          message: type === "result" ? "Congratulations on completing the quiz!" : undefined,
          description: type === "message" ? "Message description goes here" : undefined,
          mediaType: type === "message" ? "none" : undefined,
          fieldType: type === "textInput" ? "text" : undefined,
        },
      }

      setNodes((nds) => nds.concat(newNode))
      setSelectedNode(newNode)
    },
    [reactFlowInstance, setNodes],
  )

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Delete node
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      setSelectedNode(null)
    },
    [setNodes, setEdges],
  )

  // Duplicate node
  const duplicateNode = useCallback(
    (nodeId: string, newNodeId: string, data: any) => {
      // Find the node to duplicate
      const nodeToDuplicate = nodes.find((node) => node.id === nodeId)

      if (!nodeToDuplicate) return

      // Create a new node with the same type and data but with a new ID
      const newNode = {
        id: newNodeId,
        type: nodeToDuplicate.type,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        data: data,
      }

      // Add the new node to the nodes array
      setNodes((nds) => nds.concat(newNode))

      // Select the new node
      setSelectedNode(newNode)
    },
    [nodes, setNodes, setSelectedNode],
  )

  // Delete edge
  const deleteEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
  }, [selectedEdge, setEdges])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedEdge) {
          deleteEdge()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedEdge, deleteEdge])

  // Save quiz
  const saveQuiz = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) return
  
    setSaveState("saving")
    setError(null)
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const res = await fetch(`${apiUrl}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          flow_data: { nodes, edges },
        }),
      })
  
      if (!res.ok) throw new Error("Erro ao salvar o quiz")
  
      setSaveState("saved")
      setTimeout(() => setSaveState("idle"), 2000)
    } catch (error: any) {
      setError(error.message || "Erro inesperado")
      setSaveState("idle")
    }
  }, [quizId, title, description, nodes, edges])  

  // Validate quiz before publishing
  const validateQuiz = () => {
    // Check if there's at least one question node
    const hasQuestionNode = nodes.some((node) => node.type === "optionQuestion" || node.type === "imageQuestion")

    // Check if there's at least one result node
    const hasResultNode = nodes.some((node) => node.type === "result")

    // Check if all nodes are connected
    const connectedNodeIds = new Set<string>()

    // Add all sources and targets from edges
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    // Check if all nodes are in the connected set
    const allNodesConnected = nodes.every((node) => connectedNodeIds.has(node.id))

    if (!hasQuestionNode) {
      return "Quiz must have at least one question node"
    }

    if (!hasResultNode) {
      return "Quiz must have at least one result node"
    }

    if (!allNodesConnected && nodes.length > 1) {
      return "All nodes must be connected"
    }

    return null
  }

  // Publish quiz
  const publishQuiz = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) return
  
    const validationError = validateQuiz()
    if (validationError) {
      setError(validationError)
      return
    }
  
    setLoading(true)
    setError(null)
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const res = await fetch(`${apiUrl}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          flow_data: { nodes, edges },
          status: "published",
        }),
      })
  
      if (!res.ok) throw new Error("Erro ao publicar quiz")
  
      setSuccess("Quiz publicado com sucesso")
      setTimeout(() => {
        router.push(`/quiz/${quizId}`)
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Erro inesperado")
    } finally {
      setLoading(false)
    }
  }, [quizId, title, description, nodes, edges])
  

  // Get edge styles based on selection state
  const getEdgeStyle = (edge: any) => {
    if (selectedEdge && selectedEdge.id === edge.id) {
      return {
        stroke: "#ef4444",
        strokeWidth: 3,
      }
    }
    return {}
  }

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (reactFlowInstance) {
      setHasChanges(true)
    }
  }, [nodes, edges, title, description])
  

  useEffect(() => {
    if (!hasChanges) return
  
    const autoSaveTimeout = setTimeout(async () => {
      const token = localStorage.getItem("token")
      if (!token) return
  
      setSaveState("saving")
  
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const res = await fetch(`${apiUrl}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          flow_data: { nodes, edges },
        }),
      })
  
      if (!res.ok) {
        setError("Erro ao salvar automaticamente")
        setSaveState("idle")
        return
      }
  
      setHasChanges(false) // Marcar como salvo
      setSaveState("saved")
      setTimeout(() => setSaveState("idle"), 2000)
    }, 1000)
  
    return () => clearTimeout(autoSaveTimeout)
  }, [nodes, edges, title, description, quizId, hasChanges])
  
  

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/quizzes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
          <div className="flex-1 space-y-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold border-none h-auto p-0 focus-visible:ring-0"
              placeholder="Quiz Title"
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm text-muted-foreground border-none h-auto p-0 focus-visible:ring-0"
              placeholder="Quiz Description (optional)"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveQuiz} disabled={saveState === "saving"}>
            {saveState === "saving" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : saveState === "saved" ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saveState === "saving" ? "Salvando..." : saveState === "saved" ? "Salvo" : "Salvar"}
          </Button>
          <Button onClick={publishQuiz} disabled={loading}>
            Publish
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="m-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex-1 flex">
        <ReactFlowProvider>
          <div className="flex-1 h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={{
                style: { stroke: "#b1b1b7", strokeWidth: 2 },
                animated: true,
              }}
              edgesFocusable={true}
              edgesUpdatable={true}
              selectNodesOnDrag={false}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
              <Panel position="top-left" className="bg-white p-2 rounded-md shadow-md ml-2 mt-2">
                <div className="flex flex-col gap-3">
                  <Label className="text-xs font-medium text-center">Add</Label>
                  <div className="flex flex-col gap-3">
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10 bg-purple-500 hover:bg-purple-600"
                      onClick={() => addNode("optionQuestion")}
                      title="Add Options Question"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10 bg-indigo-500 hover:bg-indigo-600"
                      onClick={() => addNode("imageQuestion")}
                      title="Add Image Question"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10 bg-amber-500 hover:bg-amber-600"
                      onClick={() => addNode("message")}
                      title="Add Message"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10 bg-teal-500 hover:bg-teal-600"
                      onClick={() => addNode("textInput")}
                      title="Add Text Input"
                    >
                      <TextFields className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10 bg-blue-500 hover:bg-blue-600"
                      onClick={() => addNode("condition")}
                      title="Add Condition"
                    >
                      <GitBranch className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full w-10 h-10 bg-green-500 hover:bg-green-600"
                      onClick={() => addNode("result")}
                      title="Add Result"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {selectedEdge && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-md shadow-md z-10 flex items-center gap-2">
              <span className="text-sm">Selected connection</span>
              <Button size="sm" variant="destructive" onClick={deleteEdge} className="flex items-center gap-1">
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {selectedNode && (
            <div className="w-96 border-l bg-white p-6 overflow-y-auto">
              {selectedNode.type === "optionQuestion" && (
                <OptionQuestionEditor
                  key={selectedNode.id}
                  nodeId={selectedNode.id}
                  data={selectedNode.data}
                  onSave={updateNodeData}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  autoSave={true}
                />
              )}

              {selectedNode.type === "imageQuestion" && (
                <ImageQuestionEditor
                  key={selectedNode.id}
                  nodeId={selectedNode.id}
                  data={selectedNode.data}
                  onSave={updateNodeData}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  autoSave={true}
                />
              )}

              {selectedNode.type === "condition" && (
                <ConditionNodeEditor
                  key={selectedNode.id}
                  nodeId={selectedNode.id}
                  data={selectedNode.data}
                  nodes={nodes}
                  edges={edges}
                  onSave={updateNodeData}
                  onDelete={deleteNode}
                  autoSave={true}
                />
              )}

              {selectedNode.type === "result" && (
                <ResultNodeEditor
                  key={selectedNode.id}
                  nodeId={selectedNode.id}
                  data={selectedNode.data}
                  onSave={updateNodeData}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  autoSave={true}
                />
              )}

              {selectedNode.type === "message" && (
                <MessageNodeEditor
                  key={selectedNode.id}
                  nodeId={selectedNode.id}
                  data={selectedNode.data}
                  onSave={updateNodeData}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  autoSave={true}
                />
              )}

              {selectedNode.type === "textInput" && (
                <TextInputEditor
                  key={selectedNode.id}
                  nodeId={selectedNode.id}
                  data={selectedNode.data}
                  onSave={updateNodeData}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  autoSave={true}
                />
              )}
            </div>
          )}
        </ReactFlowProvider>
      </div>
    </div>
  )
}
