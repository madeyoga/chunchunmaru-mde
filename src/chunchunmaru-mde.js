"use strict";

function chunchunmaru(containerId, settings) {
	if (containerId === undefined) {
		throw 'First parameter (container id) cannot be null.';
	}

	settings = settings || {};

	var defaultSettings = {
		attributes: {
			id: "chunchunmaru-textarea",
			name: "chunchunmaru-textarea",
			placeholder: "Start writting!",
		},
		atLink: false,
		atLinkBase: 'https://github.com/',
		autoSave: false,
		csrfToken: null,
		gfm: true,
		livePreview: false,
		livePreviewContainer: "",
		previewCodeHighlight: false,
		sanitize: true,
		saveHTML: false,
		toolbar: [
			'bold',
			'italic',
			'strikethrough',
			'|',
			'link',
			'blockquote',
			'code',
			'image',
			'uploadImage',
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
		],
		imageUploadUrl: null,
	};

	var settings = this.settings = Object.assign(defaultSettings, settings);

	this.regexs = {
		atLink: /@(\w+)/g,
		email: /(\w+)@(\w+)\.(\w+)\.?(\w+)?/g,
		emailLink: /(mailto:)?([\w\.\_]+)@(\w+)\.(\w+)\.?(\w+)?/g,
		emoji: /:([\w\+-]+):/g,
		emojiDatetime: /(\d{2}:\d{2}:\d{2})/g,
		twemoji: /:(tw-([\w]+)-?(\w+)?):/g,
		pageBreak: /^\[[=]{8,}\]$/
	};

	this.loadScript = function (filepath, callback, into) {
		into = into || "body";
		callback = callback || function () { };

		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = filepath;
		script.setAttribute('async', '');

		var isIE = (navigator.appName == "Microsoft Internet Explorer");
		var isIE8 = (isIE && navigator.appVersion.match(/8./i) == "8.");

		if (isIE8) {
			script.onreadystatechange = function () {
				if (script.readyState) {
					if (script.readyState === "loaded" || script.readyState === "complete") {
						script.onreadystatechange = null;
						callback();
					}
				}
			};
		}
		else {
			script.onload = function () {
				callback();
			};
		}

		if (into === "body") {
			document.getElementsByTagName("body")[0].appendChild(script);
		}
		else {
			document.body.appendChild(script);
		}
	};

	this.loadCSS = function (filepath, callback, into) {
		into = into || "head";
		callback = callback || function () { };

		var css = document.createElement("link");
		css.type = "text/css";
		css.rel = "stylesheet";
		css.onload = css.onreadystatechange = function () {
			callback();
		};

		css.href = filepath;

		if (into === "head") {
			document.getElementsByTagName("head")[0].appendChild(css);
		}
		else {
			document.body.appendChild(css);
		}
	};

	this.loadScript("https://code.iconify.design/1/1.0.7/iconify.min.js");

	/**
	 * Dependencies & settings check
	 */
	if (settings.livePreview) {
		this.previewContainer = document.querySelector(this.settings.livePreviewContainer);
	}

	if (typeof marked != "undefined") {
		if (settings.previewCodeHighlight) {
			if (typeof hljs === "undefined") {
				throw 'highlight.js is not defined';
			}
		}

		var markedRenderer = new marked.Renderer();
		var atLinkReg = this.regexs.atLink;
		var emailReg = this.regexs.email;

		// atLink Renderer
		markedRenderer.paragraph = (text) => {
			if (settings.atLink) {

				if (atLinkReg.test(text)) {
					text = text.replace(emailReg, function ($1, $2, $3, $4) {
						return $1.replace(/@/g, "_#_&#64;_#_");
					});

					text = text.replace(atLinkReg, function ($1, $2) {
						return "<a href=\"" + settings.atLinkBase + "" + $2 + "\" title=\"&#64;" + $2 + "\" class=\"at-link\">" + $1 + "</a>";
					}).replace(/_#_&#64;_#_/g, "@");
				}

				return text;
			}

			return text;
		};

		var markedOptions = this.markedOptions = {
			// renderer: markedRenderer,
			gfm: settings.gfm,
			tables: true,
			breaks: true,
			pedantic: false,
			smartLists: true,
			smartypants: false,
			highlight: settings.previewCodeHighlight ? function (code, lang) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			} : false,
			langPrefix: settings.previewCodeHighlight ? 'hljs lang-' : "lang-",
		};

		marked.setOptions(markedOptions);
	}

	if (settings.sanitize) {
		if (typeof DOMPurify === "undefined") {
			throw 'DOMPurify is not defined';
		}
		// add hook to check iframe src, accept only Youtube embed.
		DOMPurify.addHook('uponSanitizeElement', (node, data) => {
			if (data.tagName === 'iframe') {
				const src = node.getAttribute('src') || ''
				if (!src.startsWith('https://www.youtube.com/embed/')) {
					return node.parentNode.removeChild(node);
				}
			}
		});
	}

	/**
	 * Load Elements
	 */
	this.container = document.getElementById(containerId);

	this.toolbar = document.createElement("div");

	this.textarea = this.container.getElementsByTagName('textarea')[0] || document.createElement("textarea");

	for (var attr in settings.attributes) {
		var value = settings.attributes[attr];
		if (!this.textarea.getAttribute(attr)) {
			this.textarea.setAttribute(attr, value);
		}
	}

	this.container.className += " chunchumaru-container";
	this.toolbar.className += " chunchunmaru-editor-toolbar";
	this.textarea.className += " chunchunmaru-editor";

	var defaultChild = this.container.children[0];
	this.container.appendChild(this.toolbar);
	if (defaultChild === undefined) {
		this.container.appendChild(this.textarea);
	}
	else {
		this.container.appendChild(defaultChild);
	}

	// File input
	this.fileInput = document.createElement('input');
	this.fileInput.type = 'file';
	this.fileInput.style.display = 'none';

	this.fileInput.addEventListener('change', () => {
		const fileInput = this.fileInput;
		const imageUploadUrl = this.settings.imageUploadUrl;

		if (fileInput.files && fileInput.files[0]) {
			const file = fileInput.files[0];
			const fileReader = new FileReader();

			fileReader.addEventListener('load', async (fileReaderEvent) => {
				// if upload url is provided
				if (imageUploadUrl) {
					const formData = new FormData();

					formData.append('image', file);
					if (settings.csrfToken) {
						formData.append('csrfmiddlewaretoken', settings.csrfToken);
					}

					const response = await fetch(imageUploadUrl, {
						method: 'POST',
						credentials: 'same-origin',
						body: formData
					});

					if (response.ok) {
						const responseJson = await response.json();
						console.log(responseJson);
						this.insertString(`\n![](${responseJson.url})\n`);
					}
					else {
						throw response.text;
					}
				}
				// else: use base64
				else {
					const base64image = fileReaderEvent.target.result;
					this.insertString(`![](${base64image})`);
				}
			});

			fileReader.readAsDataURL(file);
		}
	});

	this.container.appendChild(this.fileInput);

	/**
	 * Keyboard & Undo Redo events
	 */
	var undoState = [''];
	var redoState = [];
	var maxSaveThreshold = 20;

	this.triggerUndo = function() {
		if (undoState.length > 1) {
			redoState.push(this.textarea.value);
			this.textarea.value = undoState.pop();
		}
	}
	
	this.triggerRedo = function() {
		if (redoState.length) {
			undoState.push(this.textarea.value);
			this.textarea.value = redoState.pop();
		}
	}

	this.hotkeys = {
		'b': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.bold.action();
			}
		},

		'i': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.italic.action();
			}
		},

		'l': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.link.action();
			}
		},

		'q': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.blockquote.action();
			}
		},

		'k': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.code.action();
			}
		},

		'g': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.image.action();
			}
		},

		'o': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.ol.action();
			}
		},

		'u': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.ul.action();
			}
		},

		'z': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.undo.action();
			}
		},

		'y': (event) => {
			if (event.ctrlKey && !event.shiftKey && !event.altKey) {
				this.buttons.redo.action();
			}
		},
	};

	this.hotkeys = Object.assign(this.hotkeys, settings.hotkeys);

	this.textarea.addEventListener('keyup', (keyboardEvent) => {
		if (keyboardEvent.key in this.hotkeys) {
			if (keyboardEvent.ctrlKey && !keyboardEvent.shiftKey && !keyboardEvent.altKey) {
				keyboardEvent.preventDefault();
				this.hotkeys[keyboardEvent.key](keyboardEvent);
			}
		}

		if (!keyboardEvent.ctrlKey && !keyboardEvent.shiftKey && !keyboardEvent.altKey) {
			if (keyboardEvent.key === 'Tab')
				this.insertString("\t");
		}

		if (settings.livePreview) {
			this.previewContainer.innerHTML = this.getHTML();
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

		if (key === "Tab") {
			keyboardEvent.preventDefault();
		}

		if (!keyboardEvent.shiftKey && !keyboardEvent.altKey && keyboardEvent.ctrlKey) {
			switch (key) {
				case "z":
					keyboardEvent.preventDefault();
					break;
				case "y":
					keyboardEvent.preventDefault();
					break;
			}

			if (keyboardEvent.key in this.hotkeys) {
				keyboardEvent.preventDefault();
			}
		}
	});

	// Toolbar
	var buttons = this.buttons = {
		"bold": {
			action: () => {
				this.wrapSelection("**", "**");
			},
			icon: "mdi mdi-format-bold",
			name: "format_bold",
			title: "Bold selection Ctrl + B"
		},
		"italic": {
			action: () => {
				this.wrapSelection("_", "_");
			},
			icon: "mdi mdi-format-italic",
			name: "format_italic",
			title: "Italic selection Ctrl + I"
		},
		"strikethrough": {
			action: () => {
				this.wrapSelection("~~", "~~");
			},
			icon: "mdi mdi-format-strikethrough-variant",
			name: "format_strikethrough",
			title: "Strikethorugh selection"
		},
		"link": {
			action: () => {
				this.wrapSelection("[", "](put_your_link_url_here)");
			},
			icon: "mdi mdi-link-variant",
			name: "link",
			title: "Add link Ctrl + L"
		},
		'blockquote': {
			action: () => {
				this.addPrefixToSelectedLine("> ");
			},
			icon: "mdi mdi-format-quote-close",
			name: "format_quote",
			title: "Blockquote Ctrl + Q"
		},
		'code': {
			action: () => {
				this.wrapSelection("```python\n", "\n```");
			},
			icon: "mdi mdi-code-braces",
			name: "code",
			title: "Code sample Ctrl + K"
		},
		'image': {
			action: () => {
				this.wrapSelection("![image](", ")", 'put_your_image_url_here');
			},
			icon: "mdi mdi-image",
			name: "image",
			title: "Image Ctrl + G"
		},
		'uploadImage': {
			action: () => {
				this.fileInput.click();
			},
			icon: "mdi mdi-image-plus",
			name: "add_photo_alternate",
			title: "Upload Image"
		},
		'center': {
			action: () => {
				this.wrapSelection("<div align='center'>\n\n", "\n\n</div>");
			},
			icon: "mdi mdi-format-align-center",
			name: "format_align_center"
		},
		'ol': {
			action: () => {
				this.addOrderToSelectedLine();
			},
			icon: "mdi mdi-format-list-numbered",
			name: "format_list_numbered",
			title: "Numbered List Ctrl + O"
		},
		'ul': {
			action: () => {
				this.addPrefixToSelectedLine("- ");
			},
			icon: "mdi mdi-format-list-bulleted",
			name: "format_list_bulleted",
			title: "Bulleted List Ctrl + U"
		},
		'h1': {
			action: () => {
				this.addPrefixToSelectedLine("# ");
			},
			icon: "mdi mdi-format-header-1",
			name: "title"
		},
		'h2': {
			action: () => {
				this.addPrefixToSelectedLine("## ");
			},
			icon: "mdi mdi-format-header-2",
			name: "title"
		},
		'h3': {
			action: () => {
				this.addPrefixToSelectedLine("### ");
			},
			icon: "mdi mdi-format-header-3",
			name: "title"
		},
		'h4': {
			action: () => {
				this.addPrefixToSelectedLine("#### ");
			},
			icon: "mdi mdi-format-header-4",
			name: "title"
		},
		'h5': {
			action: () => {
				this.addPrefixToSelectedLine("##### ");
			},
			icon: "mdi mdi-format-header-5",
			name: "title"
		},
		'h6': {
			action: () => {
				this.addPrefixToSelectedLine("###### ");
			},
			icon: "mdi mdi-format-header-6",
			name: "title"
		},
		'undo': {
			action: () => {
				this.triggerUndo();
			},
			icon: "mdi mdi-undo",
			name: "undo",
			title: "Undo Ctrl + Z"
		},
		'redo': {
			action: () => {
				this.triggerRedo();
			},
			icon: "mdi mdi-redo",
			name: "redo",
			title: "Redo Ctrl + Y"
		},
	}

	this.initToolbar = () => {
		var toolbar = this.settings.toolbar;
		for (var toolName of toolbar) {
			if (toolName in buttons) {
				var buttonData = buttons[toolName];

				// Iconify
				var icon = document.createElement("span");
				icon.className += "iconify toolbar-button-icon "
				icon.setAttribute("data-icon", buttonData.icon.slice(4));
				icon.setAttribute("data-inline", "false");

				var button = document.createElement("button");
				button.onclick = buttonData.action;
				button.title = buttonData.title;
				button.type = "button";
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

		this.toolbar.addEventListener('click', () => {
			if (settings.livePreviewContainer)
				this.previewContainer.innerHTML = this.getHTML();
		});

		this.toolbar.addEventListener('mousedown', function (e) {
			e.preventDefault();
		});
	}

	this.initToolbar();

	// Preview
	if (settings.livePreview) {
		this.previewContainer.innerHTML = this.getHTML();
	}
}

chunchunmaru.prototype.wrapSelection = function(pre, post, defaultSelection='') {
	var textarea = this.textarea;
	var content = textarea.value;
	var start = textarea.selectionStart;
	var end = textarea.selectionEnd;

	let selectedText = defaultSelection;

	// if there is a selection
	if (start !== end) {
		selectedText = content.substring(start, end);
		let selectedTrimLength = selectedText.replace(/\s*$/,"").length; // selectedText.trimRight().length;
	
		if (selectedText.length !== selectedTrimLength) {
			start = textarea.selectionStart;
			end = start + selectedTrimLength;
			selectedText = content.substring(start, end);
		}

		selectedTrimLength = selectedText.replace(/^\s*/,"").length; // selectedText.trimLeft().length;

		if (selectedText.length !== selectedTrimLength) {
			start = end - selectedTrimLength;
			selectedText = content.substring(start, end);
		}
	}

	var processedText = pre + selectedText + post;

	var preText = content.substring(0, start);
	var postText = content.substring(end, textarea.value.length);

	// new content
	this.textarea.value = preText + processedText + postText;
	this.textarea.selectionStart = start + pre.length + selectedText.length;
	this.textarea.selectionEnd = start + pre.length + selectedText.length;
}

chunchunmaru.prototype.insertString = function(string) {
	var content = this.textarea.value;
	var cursorPosition = this.textarea.selectionStart;

	var preText = content.substring(0, cursorPosition);
	var postText = content.substring(cursorPosition, content.length);

	this.textarea.value = preText + string + postText;
	this.textarea.selectionStart = cursorPosition + string.length;
	this.textarea.selectionEnd = cursorPosition + string.length;
}

chunchunmaru.prototype.addPrefixToSelectedLine = function(prefix) {
	var textarea = this.textarea;
	var selectionStart = textarea.selectionStart;
	var selectionEnd = textarea.selectionEnd;

	if (selectionStart == selectionEnd) {
		var selectedLineIndex = textarea.value.substr(0, selectionStart).split("\n").length - 1;
		var lines = textarea.value.split("\n");
		lines[selectedLineIndex] = prefix + lines[selectedLineIndex];
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
}

chunchunmaru.prototype.addOrderToSelectedLine = function() {
	var textarea = this.textarea;
	var selectionStart = textarea.selectionStart;
	var selectionEnd = textarea.selectionEnd;

	var order = 1;
	if (selectionStart == selectionEnd) {
		var selectedLineIndex = textarea.value.substr(0, selectionStart).split("\n").length - 1;
		var lines = textarea.value.split("\n");
		lines[selectedLineIndex] = `${order}. ` + lines[selectedLineIndex];
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
}

chunchunmaru.prototype.saveMarkdownToInnerHTML = function() {
	this.textarea.innerHTML = this.textarea.value;
}

chunchunmaru.prototype.getHTML = function()  {
	var dirtyHTML = marked(this.textarea.value);
	if (this.settings.sanitize) {
		var cleanHTML = DOMPurify.sanitize(dirtyHTML);
		return cleanHTML;
	}
	else {
		return dirtyHTML;
	}
}

chunchunmaru.markdownToHTML = function (markdown, settings) {
	var defaults = {
		gfm: true,
		previewCodeHighlight: false,
		sanitize: true,
	}

	settings = settings || {};

	settings = Object.assign(defaults, settings);

	if (typeof marked === "undefined") {
		throw "marked is not defined";
	}

	var previewCodeHighlight = false;
	if (settings.previewCodeHighlight) {
		if (typeof hljs === "undefined") {
			throw "hljs is undefined";
		}

		previewCodeHighlight = function (code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		};
	}

	if (settings.sanitize && typeof DOMPurify === "undefined") {
		throw "DOMPurify is not defined";
	}

	var markedOptions = this.markedOptions = {
		gfm: settings.gfm,
		tables: true,
		breaks: true,
		pedantic: false,
		smartLists: true,
		smartypants: false,
		highlight: previewCodeHighlight,
		langPrefix: settings.previewCodeHighlight ? 'hljs lang-' : "lang-",
	};

	marked.setOptions(markedOptions);

	var dirtyHTML = marked(markdown);
	if (settings.sanitize) {
		var cleanHTML = DOMPurify.sanitize(dirtyHTML);
		return cleanHTML;
	}
	return dirtyHTML;
}

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	module.exports = chunchunmaru;
}
else {
	window.chunchunmaru = chunchunmaru;
}
