import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { trimSelection } from "./Utilities"

function codeRange(range: SelectionRange, state: EditorState) {
  const originalText = state.sliceDoc(range.from, range.to)
  const { text, rangeFrom, rangeTo } = trimSelection(originalText, range)
  
  let newText
  let selection

  if (originalText.includes("\n")) {
    newText = `\`\`\`\n${text}\n\`\`\``
    selection = EditorSelection.range(rangeFrom + 4, rangeTo + 4)
  }
  else {
    newText = `\`${text}\``
    selection = EditorSelection.range(rangeFrom + 1, rangeTo + 1)
  }

  const transaction = {
    changes: {
      from: rangeFrom,
      insert: newText,
      to: rangeTo,
    },
    range: selection,
  }

  return transaction
}

export function code(view: EditorView) {
  const transaction = view.state.changeByRange((range) => codeRange(range, view.state))

  view.dispatch(transaction)

  return true
}

export const codeKeyBinding = {
  key: 'Ctrl-e',
  run: code,
}
