"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash, Plus, LinkIcon, ExternalLink } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

type ResultNodeEditorProps = {
  nodeId: string
  data: {
    title: string
    message: string
    buttons?: { id: string; label: string; link: string }[]
    redirect?: { enabled: boolean; url: string; delay: number }
  }
  onSave: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
  onDuplicate?: (nodeId: string, newNodeId: string, data: any) => void
  autoSave?: boolean
}

export default function ResultNodeEditor({
  nodeId,
  data,
  onSave,
  onDelete,
  onDuplicate,
  autoSave = false,
}: ResultNodeEditorProps) {
  const [title, setTitle] = useState(data.title || "")
  const [message, setMessage] = useState(data.message || "")
  const [buttons, setButtons] = useState(data.buttons || [])
  const [redirect, setRedirect] = useState(data.redirect || { enabled: false, url: "", delay: 3 })

  const handleSave = () => {
    onSave(nodeId, {
      ...data,
      title,
      message,
      buttons,
      redirect,
    })
  }

  const handleAddButton = () => {
    setButtons([...buttons, { id: uuidv4(), label: "Button", link: "" }])
  }

  const handleUpdateButton = (id: string, field: string, value: string) => {
    setButtons(buttons.map((button) => (button.id === id ? { ...button, [field]: value } : button)))
  }

  const handleRemoveButton = (id: string) => {
    setButtons(buttons.filter((button) => button.id !== id))
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      // Create a new node ID
      const newNodeId = uuidv4()
      // Use the onDuplicate function to create a duplicate
      onDuplicate(nodeId, newNodeId, {
        title,
        message,
        buttons: [...buttons],
        redirect: { ...redirect },
      })
    }
  }

  const handleRedirectToggle = (enabled: boolean) => {
    setRedirect({ ...redirect, enabled })
  }

  const handleRedirectChange = (field: string, value: string | number) => {
    setRedirect({ ...redirect, [field]: value })
  }

  useEffect(() => {
    if (autoSave) {
      const saveTimeout = setTimeout(() => {
        onSave(nodeId, {
          ...data,
          title,
          message,
          buttons,
          redirect,
        })
      }, 500)

      return () => clearTimeout(saveTimeout)
    }
  }, [title, message, buttons, redirect, autoSave, nodeId, data, onSave])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Edit Result</h3>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="redirect">Redirect</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="result-title">Result Title</Label>
            <Input
              id="result-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter result title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="result-message">Result Message</Label>
            <Textarea
              id="result-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter result message"
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Buttons</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddButton}>
              <Plus className="h-4 w-4 mr-1" />
              Add Button
            </Button>
          </div>

          {buttons.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No buttons added. Add a button to provide links or actions.
            </div>
          ) : (
            <div className="space-y-4">
              {buttons.map((button) => (
                <div key={button.id} className="space-y-2 p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <Label>Button {buttons.indexOf(button) + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveButton(button.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`button-label-${button.id}`}>Label</Label>
                    <Input
                      id={`button-label-${button.id}`}
                      value={button.label}
                      onChange={(e) => handleUpdateButton(button.id, "label", e.target.value)}
                      placeholder="Button text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`button-link-${button.id}`}>Link URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`button-link-${button.id}`}
                        value={button.link}
                        onChange={(e) => handleUpdateButton(button.id, "link", e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1"
                      />
                      {button.link && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(button.link, "_blank")}
                          title="Test link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-2">
            Note: Buttons will not be shown if redirect is enabled.
          </div>
        </TabsContent>

        <TabsContent value="redirect" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-green-500" />
              <Label htmlFor="redirect-enabled">Enable Redirect</Label>
            </div>
            <Switch id="redirect-enabled" checked={redirect.enabled} onCheckedChange={handleRedirectToggle} />
          </div>

          {redirect.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="redirect-url">Redirect URL</Label>
                <Input
                  id="redirect-url"
                  value={redirect.url}
                  onChange={(e) => handleRedirectChange("url", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-delay">Delay (seconds before redirect)</Label>
                <Input
                  id="redirect-delay"
                  type="number"
                  min="0"
                  max="30"
                  value={redirect.delay}
                  onChange={(e) => handleRedirectChange("delay", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                Note: When redirect is enabled, buttons will not be shown and the user will be automatically redirected
                after the specified delay.
              </div>
            </>
          )}
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
