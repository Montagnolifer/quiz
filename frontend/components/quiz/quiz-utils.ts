export type FlowNode = {
  id: string
  type: string
  data: any
}

export type FlowEdge = {
  id: string
  source: string
  target: string
}

// Helper function to check if a node is a question node
export const isQuestionNode = (node: FlowNode | null | undefined): boolean => {
  if (!node) return false
  return node.type === "optionQuestion" || node.type === "imageQuestion" || node.type === "textInput"
}

// Helper function to find all possible paths from current node to result nodes
export const findPaths = (
  startNodeId: string,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string> = new Set(),
  currentPath: string[] = [],
  allPaths: string[][] = [],
): string[][] => {
  // Add current node to path and mark as visited
  currentPath.push(startNodeId)
  visited.add(startNodeId)

  const currentNode = nodes.find((node) => node.id === startNodeId)

  // If we reached a result node or a node with no outgoing edges, we found a path
  if (currentNode?.type === "result" || !edges.some((edge) => edge.source === startNodeId)) {
    allPaths.push([...currentPath])
  } else {
    // Find all outgoing edges from current node
    const outgoingEdges = edges.filter((edge) => edge.source === startNodeId)

    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        findPaths(edge.target, nodes, edges, new Set(visited), [...currentPath], allPaths)
      }
    }
  }

  return allPaths
}

// Helper function to find the most likely path based on current history
export const findMostLikelyPath = (
  nodeHistory: string[],
  currentNodeId: string,
  nodes: FlowNode[],
  edges: FlowEdge[],
): string[] => {
  // Find all possible paths from current node
  const possiblePaths = findPaths(currentNodeId, nodes, edges)

  // If no paths found, return current history
  if (possiblePaths.length === 0) {
    return nodeHistory
  }

  // Find the shortest path (most likely to be completed)
  let shortestPath = possiblePaths[0]
  for (const path of possiblePaths) {
    if (path.length < shortestPath.length) {
      shortestPath = path
    }
  }

  // Combine history with the most likely future path
  return [...nodeHistory, ...shortestPath.slice(1)]
}

// Calculate the number of question nodes in a path
export const countQuestionsInPath = (path: string[], nodes: FlowNode[]): number => {
  return path.filter((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId)
    return isQuestionNode(node)
  }).length
}

// Calculate the number of answered questions in a path
export const countAnsweredQuestionsInPath = (
  path: string[],
  answers: Record<string, string>,
  nodes: FlowNode[],
): number => {
  return path.filter((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId)
    return isQuestionNode(node) && answers[nodeId] !== undefined
  }).length
}

// Function to apply mask to input
export const applyMask = (value: string, mask: string): string => {
  if (!mask || !value) return value

  let result = ""
  let valueIndex = 0

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === "0") {
      if (/\d/.test(value[valueIndex])) {
        result += value[valueIndex]
        valueIndex++
      } else {
        valueIndex++
        i--
      }
    } else {
      result += mask[i]
    }
  }

  return result
}
