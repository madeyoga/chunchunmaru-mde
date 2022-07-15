import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"
import { addPrefixToSelection } from "./Utilities"

function ulRange(range: SelectionRange, state: EditorState) {
  const changes = addPrefixToSelection("- ", state, range)
  return {
    changes,
    range: EditorSelection.range(changes.anchor, changes.anchor)
  }
}

export function ul(view: EditorView) {
  const transaction = view.state.changeByRange((range) => ulRange(range, view.state))

  view.dispatch(transaction)

  return true
}

export const ulKeyBinding = {
  key: 'Ctrl-Shift-8',
  run: ul,
}
