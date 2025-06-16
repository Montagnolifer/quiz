import OptionQuestionNode from "./node-types/option-question-node"
import ImageQuestionNode from "./node-types/image-question-node"
import ConditionNode from "./node-types/condition-node"
import ResultNode from "./node-types/result-node"
import MessageNode from "./node-types/message-node"
import TextInputNode from "./node-types/text-input-node"

// Define node types
export const nodeTypes = {
  optionQuestion: OptionQuestionNode,
  imageQuestion: ImageQuestionNode,
  condition: ConditionNode,
  result: ResultNode,
  message: MessageNode,
  textInput: TextInputNode,
}
