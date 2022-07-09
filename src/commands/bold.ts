import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"

function boldRange(range: SelectionRange, state: EditorState) {
  const originalText = state.sliceDoc(range.from, range.to)
  const newText = `**${originalText}**`

  const transaction = {
    changes: {
      from: range.from,
      insert: newText,
      to: range.to,
    },
    range: EditorSelection.range(range.from, range.to + 4),
    selection: { anchor: range.from + 4 }
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
