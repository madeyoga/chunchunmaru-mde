import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"
import { addPrefixToSelection } from "./Utilities"

function headingRange(range: SelectionRange, state: EditorState) {
  const changes = addPrefixToSelection("### ", state, range)
  return {
    changes,
    range: EditorSelection.range(changes.anchor, changes.anchor)
  }
}

export function heading(view: EditorView) {
  const transaction = view.state.changeByRange((range) => headingRange(range, view.state))

  view.dispatch(transaction)

  return true
}
