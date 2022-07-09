import { 
  EditorSelection, 
  EditorState, 
  SelectionRange 
} from "@codemirror/state"
import { EditorView } from "codemirror"

function italicRange(range: SelectionRange, state: EditorState) {
  const originalText = state.sliceDoc(range.from, range.to)
  const newText = `_${originalText}_`

  const transaction = {
    changes: {
      from: range.from,
      insert: newText,
      to: range.to,
    },
    range: EditorSelection.range(range.from, range.to + 2),
    selection: { anchor: range.from + 2 }
  }

  return transaction
}

export function italic(view: EditorView) {
  const transaction = view.state.changeByRange((range) => 
    italicRange(range, view.state)
  )

  view.dispatch(transaction)

  return true
}

export const italicKeyBinding = {
  key: 'Ctrl-i',
  run: italic,
}
