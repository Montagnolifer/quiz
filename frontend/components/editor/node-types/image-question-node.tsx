import { memo } from "react"
import { Handle, Position } from "reactflow"

type ImageQuestionNodeProps = {
  data: {
    title: string
    options: { id: string; text: string; imageUrl?: string }[]
  }
  selected: boolean
}

export default memo(function ImageQuestionNode({ data, selected }: ImageQuestionNodeProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-indigo-100 border-2 ${selected ? "border-indigo-500" : "border-indigo-200"} shadow-sm w-64`}
    >
      <div className="font-semibold text-sm text-indigo-500 mb-1">Image Question</div>
      <div className="font-medium mb-2">{data.title || "New Image Question"}</div>
      {data.description && <div className="text-xs text-indigo-700 mb-2 italic">{data.description}</div>}
      <div className="grid grid-cols-2 gap-2">
        {data.options?.map((option, index) => (
          <div key={option.id} className="bg-white p-2 rounded-md text-sm flex flex-col items-center">
            <div className="w-full h-16 bg-gray-200 rounded-md mb-1 flex items-center justify-center text-xs text-gray-500">
              {option.imageUrl ? (
                <img
                  src={option.imageUrl || "/placeholder.svg"}
                  alt={option.text}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                "Image"
              )}
            </div>
            <span>{option.text || `Option ${index + 1}`}</span>
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
    </div>
  )
})
