import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state'
import { keymap, ViewUpdate } from '@codemirror/view'
import { italicKeyBinding } from './commands/Italic'
import { boldKeyBinding } from "./commands/Bold"
import { codeKeyBinding } from "./commands/Code"
import { linkKeyBinding } from "./commands/Link"
import { quoteKeyBinding } from "./commands/Quote"
import { ulKeyBinding } from "./commands/BulletedList"

interface ChunInterface {
  editor: EditorView,
  getValue: () => string,
}

interface ChunConfig extends EditorStateConfig {
  onUpdateListener?: (update: ViewUpdate) => void,
}

function ChunMDE(this: ChunInterface, containerId: string, customConfig?: ChunConfig) {
  const defaultExtensions = [
    keymap.of([
      italicKeyBinding,
      boldKeyBinding,
      codeKeyBinding,
      linkKeyBinding,
      quoteKeyBinding,
      ulKeyBinding,
    ]),
    markdown({ base: markdownLanguage }),
    basicSetup,
  ]

  let config: EditorStateConfig = {
    doc: "Start writing!",
    extensions: defaultExtensions,
  }

  if (customConfig !== undefined) {
    if (customConfig.onUpdateListener !== undefined) {
      defaultExtensions.push(EditorView.updateListener.of(customConfig.onUpdateListener!))
    }
    config.doc = customConfig.doc ? customConfig.doc : config.doc
    config.extensions = customConfig.extensions ? customConfig.extensions : defaultExtensions
  }

  /** CodeMirror6's EditorView */
  this.editor = new EditorView({
    parent: document.getElementById(containerId) as Element,
    state: EditorState.create(config)
  })

  /** Shortcut to get the editor value */
  this.getValue = () => {
    return this.editor.state.doc.toString()
  }
}

declare global {
  interface Window { ChunMDE: typeof ChunMDE; }
}

window.ChunMDE = ChunMDE;

export default ChunMDE;
