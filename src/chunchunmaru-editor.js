"use strict";

function chunchunmaru(containerId, settings)
{
	var defaultSettings = {
		markdown: "",
		attributes: {
			id: "editor",
			name: "editor",
			placeholder: "Start writting!",
		},
		livePreview: true,
		livePreviewContainer: "preview",
		livePreviewDelay: 2,
		previewCodeHighlight: true,
		saveHTML: false,
		autoSave: true,
		toolbars: [
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

	var settings = this.settings = Object.assign(defaultSettings, settings);

	var markedOptions = this.markedOptions = {
		gfm         : true,
		tables      : true,
		breaks      : true,
		pedantic    : false,
		smartLists  : true,
		smartypants : false,
		highlight: (settings.previewCodeHighlight) ? function(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		} : false,
		langPrefix: 'hljs lang-',
	};

	// Dependencies
	if (marked === undefined) {
		throw 'markedjs is not defined';
	}
	else {
		marked.setOptions(markedOptions);
	}

	if (DOMPurify === undefined) {
		throw 'DOMPurify is not defined';
	}
	else {
		// Check iframe src, accept only Youtube embed.
		DOMPurify.addHook('uponSanitizeElement', (node, data) => {
			if (data.tagName === 'iframe') {
				const src = node.getAttribute('src') || ''
				if (!src.startsWith('https://www.youtube.com/embed/')) {
					return node.parentNode?.removeChild(node)
				}
			}
		});
	}

	// Load elements
	this.container = document.getElementById(containerId);

	this.toolbar = document.createElement("div");

	this.textarea = document.createElement("textarea");

	this.textarea.value = settings.markdown;

	for (var attr in settings.attributes) {
		var value = settings.attributes[attr];
		this.textarea.setAttribute(attr, value);
	}

	this.container.className += "chunchumaru-container";
	this.toolbar.className += "chunchunmaru-editor-toolbar";
	this.textarea.className += "chunchunmaru-editor";

	this.container.appendChild(this.toolbar);
	this.container.appendChild(this.textarea);

	// Methods
	this.markdownToHTML = (markdown) => {
		
	}

	// Actions
	this.boldSelection = () => {
		var textarea = this.textarea;
		var content = textarea.value;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;

		var boldText = "**" + window.getSelection() + "**";
		
		var preText = content.substring(0, start);
		var postText = content.substring(end, textarea.value.length);

		// new content
		this.textarea.value = preText + boldText + postText;
		this.textarea.selectionStart = start + boldText.length;
		this.textarea.selectionEnd = start + boldText.length;
	}

	this.italicSelection = () => {
		var textarea = this.textarea;
		var content = textarea.value;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;

		var italicText = "*" + window.getSelection() + "*";
		
		var preText = content.substring(0, start);
		var postText = content.substring(end, textarea.value.length);

		// new content
		this.textarea.value = preText + italicText + postText;
		this.textarea.selectionStart = start + italicText.length;
		this.textarea.selectionEnd = start + italicText.length;
	}

	this.addPrefixToSelectedLine = (prefix) => {
		var textarea = this.textarea;
		var selectionStart = textarea.selectionStart;
		var selectionEnd = textarea.selectionEnd;

		if (selectionStart == selectionEnd) {
			var lines = textarea.value.substr(0, selectionStart).split("\n");
			lines[lines.length - 1] = prefix + lines[lines.length - 1];
		}
		else {
			var lineStartIndex = textarea.value.substr(0, selectionStart).split("\n").length - 1;
			var lineEndIndex = textarea.value.substr(0, selectionEnd).split("\n").length - 1;

			var lines = textarea.value.split("\n");
			if (lineStartIndex > lineEndIndex) {
				var temp = lineEndIndex;
				lineEndIndex = lineStartIndex;
				lineStartIndex = temp;
			}

			while (lineStartIndex <= lineEndIndex) {
				lines[lineStartIndex] = prefix + lines[lineStartIndex];
				lineStartIndex += 1;
			}
		}
		this.textarea.value = lines.join("\n");
		this.textarea.focus();
	}

	this.addOrderToSelectedLine = (prefix) => {
		var textarea = this.textarea;
		var selectionStart = textarea.selectionStart;
		var selectionEnd = textarea.selectionEnd;

		var order = 1;
		if (selectionStart == selectionEnd) {
			var lines = textarea.value.substr(0, selectionStart).split("\n");
			lines[lines.length - 1] = order + lines[lines.length - 1];
		}
		else {
			var lineStartIndex = textarea.value.substr(0, selectionStart).split("\n").length - 1;
			var lineEndIndex = textarea.value.substr(0, selectionEnd).split("\n").length - 1;

			var lines = textarea.value.split("\n");
			if (lineStartIndex > lineEndIndex) {
				var temp = lineEndIndex;
				lineEndIndex = lineStartIndex;
				lineStartIndex = temp;
			}

			while (lineStartIndex <= lineEndIndex) {
				lines[lineStartIndex] = `${order}. ` + lines[lineStartIndex];
				lineStartIndex += 1;
				order += 1;
			}
		}
		this.textarea.value = lines.join("\n");
		this.textarea.focus();
	}

	this.saveValueToInnerHTML = () => {
		this.textarea.innerHTML = this.textarea.value;
	}

	// Keyboard & Undo Redo events
	var undoState = [''];
	var redoState = [];
	var maxSaveThreshold = 20;

	this.hotkeys = {
		'b': (event) => {
			if (event.ctrlKey) {
				this.boldSelection();
			}
		},

		'i': (event) => {
			if (event.ctrlKey) {
				this.italicSelection();
			}
		},

		'Tab': (event) => {
			var content = this.textarea.value;
			var cursorPosition = this.textarea.selectionStart;

			var preText = content.substring(0, cursorPosition);
			var postText = content.substring(cursorPosition, content.length);

			var tab = "    ";
			this.textarea.value = preText + tab + postText;
			this.textarea.selectionStart = cursorPosition + tab.length;
			this.textarea.selectionEnd = cursorPosition + tab.length;
		}
	};

	this.hotkeys = Object.assign(this.hotkeys, settings.hotkeys);

	this.triggerUndo = () => {
		if (undoState.length > 1) {
			redoState.push(this.textarea.value);
			this.textarea.value = undoState.pop();
		}
	}

	this.triggerRedo = () => {
		if (redoState.length) {
			undoState.push(this.textarea.value);
			this.textarea.value = redoState.pop();
		}
	}

	this.textarea.addEventListener('keyup', (keyboardEvent) => {
		if (keyboardEvent.key in this.hotkeys) {
			this.hotkeys[keyboardEvent.key](keyboardEvent);
		}
		if (settings.livePreview) {
			var dirtyHTML = marked(this.textarea.value);
			this.previewContainer.innerHTML = DOMPurify.sanitize(dirtyHTML);
		}
	});

	this.textarea.addEventListener('keydown', (keyboardEvent) => {
		const key = keyboardEvent.key;
		if (key === " " || key === "Backspace" || key === "Delete") {
			// clear redo state
			if (redoState.length) {
				redoState = [];
			}

			if (undoState.length > maxSaveThreshold) {
				undoState.shift();
			}
			undoState.push(this.textarea.value);
		}
		if (keyboardEvent.ctrlKey && key === "z") {
			keyboardEvent.preventDefault();
			this.triggerUndo();
		}
		if (keyboardEvent.ctrlKey && key === "y") {
			keyboardEvent.preventDefault();
			this.triggerRedo();
		}
		if (key === "Tab") {
			keyboardEvent.preventDefault();
		}
	});

	// Toolbar
	var buttons = {
		"bold": {
			action: () => {
				this.boldSelection();
			},
			icon: "mdi mdi-format-bold",
		},
		"italic": {
			action: () => {
				this.italicSelection();
			},
			icon: "mdi mdi-format-italic",
		},
		"link": {
			action: () => {

			},
			icon: "mdi mdi-link-variant"
		},
		'blockquote': {
			action: () => {
				this.addPrefixToSelectedLine("> ");
			},
			icon: "mdi mdi-format-quote-close"
		},
		'code': {
			action: () => {

			},
			icon: "mdi mdi-code-braces"
		},
		'image': {
			action: () => {

			},
			icon: "mdi mdi-image"
		},
		'ol': {
			action: () => {
				this.addOrderToSelectedLine();
			},
			icon: "mdi mdi-format-list-numbered"
		},
		'ul': {
			action: () => {
				this.addPrefixToSelectedLine("- ");
			},
			icon: "mdi mdi-format-list-bulleted"
		},
		'h1': {
			action: () => {
				this.addPrefixToSelectedLine("# ");
			},
			icon: "mdi mdi-format-header-1"
		},
		'h2': {
			action: () => {
				this.addPrefixToSelectedLine("## ");
			},
			icon: "mdi mdi-format-header-2"
		},
		'h3': {
			action: () => {
				this.addPrefixToSelectedLine("### ");
			},
			icon: "mdi mdi-format-header-3"
		},
		'h4': {
			action: () => {
				this.addPrefixToSelectedLine("#### ");
			},
			icon: "mdi mdi-format-header-4"
		},
		'h5': {
			action: () => {
				this.addPrefixToSelectedLine("##### ");
			},
			icon: "mdi mdi-format-header-5"
		},
		'h6': {
			action: () => {
				this.addPrefixToSelectedLine("###### ");
			},
			icon: "mdi mdi-format-header-6"
		},
		'undo': {
			action: () => {
				this.triggerUndo();
			},
			icon: "mdi mdi-undo"
		},
		'redo': {
			action: () => {
				this.triggerRedo();
			},
			icon: "mdi mdi-redo"
		},
	}

	this.initToolbar = () => {
		var toolbars = this.settings.toolbars;
		for (var toolName of toolbars) {
			if (toolName in buttons) {
				var buttonData = buttons[toolName];

				var icon = document.createElement("i");
				icon.className += "toolbar-button-icon " + buttonData.icon;
				
				var button = document.createElement("button");
				button.onclick = buttonData.action;
				button.type ="button";
				button.appendChild(icon);

				this.toolbar.appendChild(button);
			}
			else if (toolName === "|") {
				var hr = document.createElement("hr");
				hr.setAttribute("role", "separator");
				hr.setAttribute("aria-orientation", "vertical");
				hr.className += "toolbar-button-divider";

				this.toolbar.appendChild(hr);
			}
		}
	}

	this.initToolbar();

	// Preview
	if (settings.livePreview) {
		this.previewContainer = document.querySelector(this.settings.livePreviewContainer);

		var dirtyHTML = marked(this.textarea.value);
		this.previewContainer.innerHTML = DOMPurify.sanitize(dirtyHTML);
	}
}
