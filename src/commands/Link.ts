import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"
import { trimSelection } from "./Utilities"

function linkRange(range: SelectionRange, state: EditorState) {
  const originalText = state.sliceDoc(range.from, range.to)
  const { text, rangeFrom, rangeTo } = trimSelection(originalText, range)

  const newText = originalText.startsWith("http") ? `[](${text})` : `[${text}](url)`

  const transaction = {
    changes: {
      from: rangeFrom,
      insert: newText,
      to: rangeTo,
    },
    range: EditorSelection.range(rangeFrom + 1, rangeFrom + 1),
  }

  return transaction
}

export function link(view: EditorView) {
  const transaction = view.state.changeByRange((range) => linkRange(range, view.state))

  view.dispatch(transaction)

  return true
}

export const linkKeyBinding = {
  key: 'Ctrl-k',
  run: link,
}
