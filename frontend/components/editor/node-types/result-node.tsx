import { memo } from "react"
import { Handle, Position } from "reactflow"

type ResultNodeProps = {
  data: {
    title: string
    message: string
    buttons?: { id: string; label: string; link: string }[]
    redirect?: { enabled: boolean; url: string; delay: number }
  }
  selected: boolean
}

export default memo(function ResultNode({ data, selected }: ResultNodeProps) {
  const hasButtons = data.buttons && data.buttons.length > 0
  const hasRedirect = data.redirect?.enabled && data.redirect?.url

  return (
    <div
      className={`p-4 rounded-xl bg-green-100 border-2 ${selected ? "border-green-500" : "border-green-200"} shadow-sm w-64`}
    >
      <div className="font-semibold text-sm text-green-500 mb-1">Result</div>
      <div className="font-medium mb-2">{data.title || "New Result"}</div>
      <div className="bg-white p-2 rounded-md text-sm mb-2">
        {data.message || "Congratulations on completing the quiz!"}
      </div>

      {hasRedirect && (
        <div className="bg-green-50 p-2 rounded-md text-xs text-green-600 mb-2">
          Redirect: {data.redirect.url} (after {data.redirect.delay}s)
        </div>
      )}

      {hasButtons && !hasRedirect && (
        <div className="bg-green-50 p-2 rounded-md text-xs text-green-600">
          {data.buttons.length} button{data.buttons.length !== 1 ? "s" : ""}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-500" />
    </div>
  )
})
