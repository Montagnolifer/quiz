import { memo } from "react"
import { Handle, Position } from "reactflow"

type MessageNodeProps = {
  data: {
    title: string
    description: string
    mediaType: "none" | "image" | "video"
    mediaUrl?: string
    timerDuration?: number
  }
  selected: boolean
}

export default memo(function MessageNode({ data, selected }: MessageNodeProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-amber-100 border-2 ${selected ? "border-amber-500" : "border-amber-200"} shadow-sm w-64`}
    >
      <div className="font-semibold text-sm text-amber-500 mb-1">Message</div>
      <div className="font-medium mb-2">{data.title || "New Message"}</div>
      <div className="bg-white p-2 rounded-md text-sm mb-2 line-clamp-2">
        {data.description || "Message description goes here"}
      </div>

      {data.mediaType !== "none" && (
        <div className="bg-amber-50 p-2 rounded-md text-xs text-amber-600 mb-2">
          {data.mediaType === "image" ? "Has image" : "Has video"}
        </div>
      )}

      {data.timerDuration ? (
        <div className="bg-amber-50 p-2 rounded-md text-xs text-amber-600">Timer: {data.timerDuration} seconds</div>
      ) : (
        <div className="bg-amber-50 p-2 rounded-md text-xs text-amber-600">No timer</div>
      )}

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-amber-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500" />
    </div>
  )
})
