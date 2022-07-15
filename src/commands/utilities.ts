import { ChangeSpec, EditorState, SelectionRange } from "@codemirror/state"

export const wrapString = (text: string, prefix: string, postfix: string): string => {
  return `${prefix}${text.trim()}${postfix}`
}

export interface TrimSelectionResult {
  text: string,
  rangeFrom: number,
  rangeTo: number,
  spaceLeft: number,
  spaceRight: number,
}

export const trimSelection = (text: string, range: SelectionRange): TrimSelectionResult => {
  const originalText = text

  if (text.trim().length < 1) {
    return {
      text: "",
      rangeFrom: range.from,
      rangeTo: range.to,
      spaceLeft: 0,
      spaceRight: 0,
    }
  }

  let spaceLeft = 0
  let spaceRight = 0

  for (let i = 0; i < originalText.length; i++) {
    if (originalText[i] !== " ") {
      break
    }
    spaceLeft += 1
  }

  for (let i = originalText.length - 1; i > -1; i--) {
    if (originalText[i] !== " ") {
      break
    }
    spaceRight += 1
  }

  return {
    text: originalText.substring(spaceLeft, originalText.length - spaceRight),
    rangeFrom: range.from + spaceLeft,
    rangeTo: range.to - spaceRight,
    spaceLeft,
    spaceRight
  }
}

export const addPrefixToSelection = (prefix: string, state: EditorState, range: SelectionRange) => {
  const docText = state.doc.toString()
  let text = state.sliceDoc(range.from, range.to)

  let rangeFrom = range.from

  while (rangeFrom > 0) {
    if (docText[rangeFrom - 1] === "\n") {
      break
    }
    rangeFrom -= 1
  }

  text = state.sliceDoc(rangeFrom, range.to)
  const textBefore = `\n${text}`
  const newText = textBefore.replace(/\n/g, `\n${prefix}`)

  const changes = {
    from: rangeFrom,
    to: range.to,
    insert: newText,
    anchor: rangeFrom + prefix.length + 1,
    textBefore: textBefore
  }

  return changes
}
