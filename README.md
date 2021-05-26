# chunchunmaru-mde
**chunchumaru** **m**ark**d**own **e**ditor: Simple and lightweight markdown editor component based on vanilla js & marked.

### Features
- Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown);
- Full-featured: Real-time Preview, Image upload, Code syntax highlighting...;
- Compatible with all major browsers (IE8+);

## Download & Install
Github Download

## Usages
**Create a chunchunmaru markdown editor**
```html
<link rel="stylesheet" href="highlight.js/10.7.2/styles/dracula.min.css"/>
<link rel="stylesheet" href="@mdi/font@5.9.55/css/materialdesignicons.min.css">

<!-- Load chunchunmaru theme -->
<link rel="stylesheet" type="text/css" href="src/chunchunmaru-mde-dracula.css">

<div id="editor-container" name="editor-container"></div>
<div id="markdown-preview"></div>

<script type="text/javascript" src="purify.min.js"></script>
<script type="text/javascript" src="highlight.min.js"></script>
<script type="text/javascript" src="marked.min.js"></script>

<script type="text/javascript" src="src/chunchunmaru-editor.js"></script>
<script type="text/javascript">
	var settings = { livePreviewContainer: "#markdown-preview" }
  
	var editor = new chunchunmaru("editor-container", settings);
</script>
```

### Options
chunchunmaru markdown editor options and default values:

```js
{
  markdown: "",                     // Initial markdown code
  attributes: {                     // textarea attributes
    id: "editor",
    name: "editor",
    placeholder: "Start writting!",
  },
  livePreview: true,               // Live preview markdown
  livePreviewContainer: "",         // Container id / class, get element using document.querySelector()
  previewCodeHighlight: true,       // Highlight source code, using highlight.js
  saveHTML: false,                  // saveHTML to hidden textarea
  autoSave: false,                  // Auto save to localStorage
  toolbars: [                       // Toolbars list, remove any button you don't want to use/ include.
    'bold',
    'italic',
    '|',
    'link',
    'blockquote',
    'code',
    'image',
    '|',
    'ol',
    'ul',
    '|',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    '|',
    'undo',
    'redo',
  ]
};
```

## Dependents
- [marked.js](https://marked.js.org/) / [marked repo](https://github.com/markedjs/marked)
- [highlight.js](https://highlightjs.org/) / [highlight.js repo](https://github.com/highlightjs/highlight.js)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Material Design Icons](https://materialdesignicons.com/)

## Contribute
- [Fork the repository](https://github.com/madeyoga/chunchunmaru-mde.git)!
- Clone your fork: `git clone https://github.com/your-username/chunchunmaru-mde.git`
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :>
