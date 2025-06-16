import { memo } from "react"
import { Handle, Position } from "reactflow"

type ConditionNodeProps = {
  data: {
    title: string
    conditions: {
      sourceId: string
      optionId: string
      targetId: string
      optionText?: string
      targetNodeTitle?: string
    }[]
    getOptionName?: (optionId: string) => string
    getNodeName?: (nodeId: string) => string
  }
  selected: boolean
}

export default memo(function ConditionNode({ data, selected }: ConditionNodeProps) {
  // Funções para obter os nomes das opções e nós
  const getOptionName = (condition: any) => {
    if (condition.optionText) return condition.optionText
    if (data.getOptionName) return data.getOptionName(condition.optionId)
    return condition.optionId
  }

  const getNodeName = (condition: any) => {
    if (condition.targetNodeTitle) return condition.targetNodeTitle
    if (data.getNodeName) return data.getNodeName(condition.targetId)
    return condition.targetId
  }

  return (
    <div
      className={`p-4 rounded-xl bg-blue-100 border-2 ${selected ? "border-blue-500" : "border-blue-200"} shadow-sm w-64`}
    >
      <div className="font-semibold text-sm text-blue-500 mb-1">Condition</div>
      <div className="font-medium mb-2">{data.title || "New Condition"}</div>
      <div className="space-y-1 text-sm">
        {data.conditions?.length > 0 ? (
          data.conditions.map((condition, index) => (
            <div key={index} className="bg-white p-2 rounded-md flex items-center text-xs">
              <span className="font-medium text-blue-600">if</span>
              <span
                className="mx-1 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]"
                title={`Option ID: ${condition.optionId}`}
              >
                {getOptionName(condition)}
              </span>
              <span className="mx-1">→</span>
              <span
                className="px-1.5 py-0.5 bg-green-50 rounded border border-green-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]"
                title={`Node ID: ${condition.targetId}`}
              >
                {getNodeName(condition)}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-white p-2 rounded-md text-gray-500 text-xs italic">No conditions set</div>
        )}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  )
})
