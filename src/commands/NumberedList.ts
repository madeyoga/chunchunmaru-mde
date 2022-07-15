import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"
import { addPrefixToSelection } from "./Utilities"

function olRange(range: SelectionRange, state: EditorState) {
  const changes = addPrefixToSelection("1 ", state, range)
  return {
    changes,
    range: EditorSelection.range(changes.anchor, changes.anchor)
  }
}

export function ol(view: EditorView) {
  const transaction = view.state.changeByRange((range) => olRange(range, view.state))

  view.dispatch(transaction)

  return true
}

export const olKeyBinding = {
  key: 'Ctrl-Shift-8',
  run: ol,
}
