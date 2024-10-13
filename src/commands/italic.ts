import { 
  EditorSelection, 
  EditorState, 
  SelectionRange 
} from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { trimSelection } from "./Utilities"

function italicRange(range: SelectionRange, state: EditorState) {
  const originalText = state.sliceDoc(range.from, range.to)

  const {text, rangeFrom, rangeTo } = trimSelection(originalText, range)

  const newText = `_${text}_`

  const transaction = {
    changes: {
      from: rangeFrom,
      insert: newText,
      to: rangeTo,
    },
    range: EditorSelection.range(rangeFrom + 1, rangeTo + 1),
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
