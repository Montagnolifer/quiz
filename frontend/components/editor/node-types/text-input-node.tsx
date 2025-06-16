import { memo } from "react"
import { Handle, Position } from "reactflow"

type TextInputNodeProps = {
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
  selected: boolean
}

export default memo(function TextInputNode({ data, selected }: TextInputNodeProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-teal-100 border-2 ${selected ? "border-teal-500" : "border-teal-200"} shadow-sm w-64`}
    >
      <div className="font-semibold text-sm text-teal-500 mb-1">Text Input</div>
      <div className="font-medium mb-2">{data.title || "New Text Input"}</div>
      {data.description && <div className="text-xs text-teal-700 mb-2 italic">{data.description}</div>}
      <div className="bg-white p-2 rounded-md text-sm mb-2 flex items-center">
        <span className="text-gray-400">{data.placeholder || "Enter text..."}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {data.required && <div className="bg-teal-50 px-2 py-1 rounded-md text-xs text-teal-600">Required</div>}
        <div className="bg-teal-50 px-2 py-1 rounded-md text-xs text-teal-600">Type: {data.fieldType || "text"}</div>
        {data.mask && <div className="bg-teal-50 px-2 py-1 rounded-md text-xs text-teal-600">Mask: {data.mask}</div>}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-teal-500" />
    </div>
  )
})
