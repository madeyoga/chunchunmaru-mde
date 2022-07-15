import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"
import { trimSelection } from "./Utilities"

function boldRange(range: SelectionRange, state: EditorState) {
  const originalText = state.sliceDoc(range.from, range.to)

  const {text, rangeFrom, rangeTo } = trimSelection(originalText, range)

  const newText = `**${text}**`

  const transaction = {
    changes: {
      from: rangeFrom,
      insert: newText,
      to: rangeTo,
    },
    range: EditorSelection.range(rangeFrom + 2, rangeTo + 2),
  }

  return transaction
}

export function bold(view: EditorView) {
  const transaction = view.state.changeByRange((range) =>
    boldRange(range, view.state)
  )

  view.dispatch(transaction)

  return true
}

export const boldKeyBinding = {
  key: 'Ctrl-b',
  run: bold,
}
