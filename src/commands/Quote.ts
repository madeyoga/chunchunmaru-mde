import {
  EditorSelection,
  EditorState,
  SelectionRange
} from "@codemirror/state"
import { EditorView } from "codemirror"
import { addPrefixToSelection } from "./Utilities"

function quoteRange(range: SelectionRange, state: EditorState) {
  // const docText = state.doc.toString()
  // let text = state.sliceDoc(range.from, range.to)

  // let rangeFrom = range.from

  // while (rangeFrom > 0) {
  //   if (docText[rangeFrom - 1] === "\n") {
  //     break
  //   }
  //   rangeFrom -= 1
  // }

  // text = state.sliceDoc(rangeFrom, range.to)

  // const changes = {
  //   from: rangeFrom,
  //   to: range.to,
  //   insert: `\n${text}`.replace(/\n/g, "\n> ")
  // }
  const changes = addPrefixToSelection("> ", state, range)
  return {
    changes, 
    range: EditorSelection.range(changes.anchor, changes.anchor)
  }
}

export function quote(view: EditorView) {
  const transaction = view.state.changeByRange((range) => quoteRange(range, view.state))

  view.dispatch(transaction)

  return true
}

export const quoteKeyBinding = {
  key: 'Ctrl-Shift-.',
  run: quote,
}
