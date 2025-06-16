import { memo } from "react"
import { Handle, Position } from "reactflow"

type OptionQuestionNodeProps = {
  data: {
    title: string
    options: { id: string; text: string }[]
    description?: string
  }
  selected: boolean
}

export default memo(function OptionQuestionNode({ data, selected }: OptionQuestionNodeProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-purple-100 border-2 ${selected ? "border-purple-500" : "border-purple-200"} shadow-sm w-64`}
    >
      <div className="font-semibold text-sm text-purple-500 mb-1">Options Question</div>
      <div className="font-medium mb-2">{data.title || "New Options Question"}</div>
      {data.description && <div className="text-xs text-purple-700 mb-2 italic">{data.description}</div>}
      <div className="space-y-1">
        {data.options?.map((option, index) => (
          <div key={option.id} className="bg-white p-2 rounded-md text-sm">
            {option.text || `Option ${index + 1}`}
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </div>
  )
})
