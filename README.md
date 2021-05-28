# chunchunmaru-mde
**chunchunmaru** **m**ark**d**own **e**ditor: Simple and lightweight and responsive markdown editor component based on vanilla js & marked.

### Features
- Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown)
- Full-featured: Real-time Preview, Code syntax highlighting, Toolbar,...
- Compatible with all major browsers (IE8+).

Features in mind:
- Support `@mention`
- Drag & drop image upload

[Demo page](https://madeyoga.github.io/chunchunmaru-mde/)

## Download & Install
Github Download

## Usages
**Create a basic chunchunmaru markdown editor**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css">

<!-- Load chunchunmaru theme -->
<link rel="stylesheet" type="text/css" href="src/chunchunmaru-mde-dracula.css">

<div id="editor-container" name="editor-container"></div>

<script type="text/javascript" src="purify.min.js"></script>
<script type="text/javascript" src="src/chunchunmaru-editor.js"></script>
<script type="text/javascript">
	var settings = {}
	var editor = new chunchunmaru("editor-container", settings);
</script>
```

### Settings
chunchunmaru markdown editor settings and default values:

```js
{
	attributes: {
	  id: "editor",
	  name: "editor",
	  placeholder: "Start writting!",
	},
	autoSave: false,
	gfm: true,
	livePreview: false,		// Requires marked
	livePreviewContainer: "",
	previewCodeHighlight: false,	// Requires highlight.js
	sanitize: true,
	saveHTML: false,
	toolbars: [			// Remove to exclude button.
	  'bold',
	  'italic',
	  '|',
	  'link',
	  'blockquote',
	  'code',
	  'image',
	  '|',
	  'center',
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
- Live preview: [marked.js](https://marked.js.org/) / [marked repo](https://github.com/markedjs/marked)
- Code syntax highlighting: [highlight.js](https://highlightjs.org/) / [highlight.js repo](https://github.com/highlightjs/highlight.js)
- Sanitize output HTML: [DOMPurify](https://github.com/cure53/DOMPurify)
- [Material Design Icons](https://materialdesignicons.com/)

## Contribute
- [Fork the repository](https://github.com/madeyoga/chunchunmaru-mde.git)!
- Clone your fork: `git clone https://github.com/your-username/chunchunmaru-mde.git`
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :>
