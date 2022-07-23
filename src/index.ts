import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state'
import { keymap, ViewUpdate } from '@codemirror/view'
import { italic, italicKeyBinding } from './commands/Italic'
import { bold, boldKeyBinding } from "./commands/Bold"
import { code, codeKeyBinding } from "./commands/Code"
import { link, linkKeyBinding } from "./commands/Link"
import { quote, quoteKeyBinding } from "./commands/Quote"
import { ul, ulKeyBinding } from "./commands/BulletedList"
import { heading } from "./commands/Heading"

interface ChunInterface {
  editor: EditorView,
  getValue: () => string,
}

interface ChunConfig extends EditorStateConfig {
  onUpdateListener?: (update: ViewUpdate) => void,
}

function ChunMDE(this: ChunInterface, containerId: string, customConfig?: ChunConfig) {
  const parentElement = document.getElementById(containerId) as Element

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
    // parent: parentElement,
    state: EditorState.create(config)
  })

  const toolbarButtons = [
    {
      text: "Add heading text",
      icon: "mdi-format-header-3",
      action: () => heading(this.editor),
    },
    {
      text: "Add bold text, <Ctrl+b>",
      icon: "mdi-format-bold",
      action: () => bold(this.editor),
    },
    {
      text: "Add italic text, <Ctrl+i>",
      icon: "mdi-format-italic",
      action: () => italic(this.editor),
    },
    {
      text: "Add a quote, <Ctrl+Shift+.>",
      icon: "mdi-format-quote-close",
      action: () => quote(this.editor),
    },
    {
      text: "Add code, <Ctrl+e>",
      icon: "mdi-code-tags",
      action: () => code(this.editor),
    },
    {
      text: "Add a link, <Ctrl+k>",
      icon: "mdi-link-variant",
      action: () => link(this.editor),
    },
    {
      text: "Add a bulleted list, <Ctrl+Shift+8>",
      icon: "mdi-format-list-bulleted",
      action: () => ul(this.editor),
    },
  ]

  parentElement.className += " chunmde-container"

  // toolbar
  const toolbarElement = document.createElement("div") as Element
  toolbarElement.className += " chunmde-toolbar"

  for (let btnSpec of toolbarButtons) {
    const buttonElement = document.createElement("button")

    const icon = document.createElement("span")
    icon.className += "iconify "
    icon.setAttribute("data-icon", btnSpec.icon)
    icon.setAttribute("data-inline", "false")
    icon.setAttribute("data-width", "16")
    icon.setAttribute("data-height", "16")

    buttonElement.appendChild(icon)
    buttonElement.onclick = btnSpec.action
    buttonElement.setAttribute("alt", btnSpec.text)
    buttonElement.title = btnSpec.text
    // buttonElement.className += " chunmde-button-icon"

    toolbarElement.appendChild(buttonElement)
  }

  parentElement.appendChild(toolbarElement)

  // editor
  parentElement.appendChild(this.editor.dom)

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
