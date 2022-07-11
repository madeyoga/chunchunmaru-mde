import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { italicKeyBinding } from './commands/italic'
import { boldKeyBinding } from "./commands/bold"

interface ChunchunmaruInterface {
  editor: EditorView
}

function ChunMDE(this: ChunchunmaruInterface, containerId: string) {
  const startState = EditorState.create({
    doc: "Start writing!",
    extensions: [
      keymap.of([
        italicKeyBinding,
        boldKeyBinding
      ]),
      basicSetup,
      markdown({ base: markdownLanguage }),
    ],
  });

  this.editor = new EditorView({
    parent: document.getElementById(containerId) as Element,
    state: startState
  })
}

declare global {
  interface Window { ChunMDE: typeof ChunMDE; }
}

window.ChunMDE = ChunMDE;

export default ChunMDE;
