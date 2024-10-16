import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { EditorState, EditorStateConfig } from '@codemirror/state'
import { keymap, ViewUpdate, EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { indentWithTab } from "@codemirror/commands"
import { italicKeyBinding } from './commands/Italic'
import { boldKeyBinding } from "./commands/Bold"
import { codeKeyBinding } from "./commands/Code"
import { linkKeyBinding } from "./commands/Link"
import { quoteKeyBinding } from "./commands/Quote"
import { ulKeyBinding } from "./commands/BulletedList"
import { Toolbar } from "./components/Toolbar"

interface ChunInterface {
  dom: Element,
  toolbar: Toolbar,
  editor: EditorView,
  getValue: () => string,
}

interface ChunConfig extends EditorStateConfig {
  onUpdateListener?: (update: ViewUpdate) => void,
  indentWithTab?: boolean,
  lineWrapping?: boolean,
}

function ChunMDE(this: ChunInterface, containerId: string, customConfig?: ChunConfig) {
  const parentElement = document.getElementById(containerId) as Element

  const defaultKeybinds = [
    italicKeyBinding,
    boldKeyBinding,
    codeKeyBinding,
    linkKeyBinding,
    quoteKeyBinding,
    ulKeyBinding,
  ]

  const defaultExtensions = [
    keymap.of(defaultKeybinds),
    markdown({ base: markdownLanguage }),
    basicSetup,
  ]

  let config: EditorStateConfig = {
    doc: "Start writing!",
    extensions: defaultExtensions,
  }

  if (customConfig) {
    if (customConfig.onUpdateListener) {
      defaultExtensions.push(EditorView.updateListener.of(customConfig.onUpdateListener!))
    }
    if (customConfig.lineWrapping) {
      defaultExtensions.push(EditorView.lineWrapping)
    }
    if (customConfig.indentWithTab) {
      defaultExtensions.push(keymap.of([indentWithTab]))
    }
    config.doc = customConfig.doc ? customConfig.doc : config.doc
    config.extensions = customConfig.extensions ? customConfig.extensions : defaultExtensions
  }

  /** CodeMirror6's EditorView */
  const editorView = new EditorView({
    // parent: parentElement,
    state: EditorState.create(config)
  })

  parentElement.className += " chunmde-container"

  // toolbar
  const toolbar = new Toolbar(editorView)

  parentElement.appendChild(toolbar.dom)
  parentElement.appendChild(editorView.dom)

  /** Shortcut to get the editor value */
  this.getValue = () => {
    return editorView.state.doc.toString()
  }

  this.dom = parentElement
  this.toolbar = toolbar
  this.editor = editorView
}

declare global {
  interface Window { ChunMDE: typeof ChunMDE; }
}

window.ChunMDE = ChunMDE;

export default ChunMDE;
