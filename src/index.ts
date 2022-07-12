import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state'
import { keymap, ViewUpdate } from '@codemirror/view'
import { italicKeyBinding } from './commands/italic'
import { boldKeyBinding } from "./commands/bold"

interface ChunInterface {
  editor: EditorView,
}

interface ChunConfig extends EditorStateConfig {
  onUpdateListener?: (update: ViewUpdate) => void,
}

function ChunMDE(this: ChunInterface, containerId: string, customConfig?: ChunConfig) {
  const defaultExtensions = [
    keymap.of([
      italicKeyBinding,
      boldKeyBinding
    ]),
    basicSetup,
    markdown({ base: markdownLanguage }),
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

  this.editor = new EditorView({
    parent: document.getElementById(containerId) as Element,
    state: EditorState.create(config)
  })
}

declare global {
  interface Window { ChunMDE: typeof ChunMDE; }
}

window.ChunMDE = ChunMDE;

export default ChunMDE;
