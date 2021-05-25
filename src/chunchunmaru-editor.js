"use strict";

function Chunchunmaru(containerId, settings)
{
	var defaultSettings = {
		tags: {
			id: "editor",
			name: "editor",
		},
		livePreview: true,
		livepreviewContainerId: "preview",
		livePreviewDelay: 2,
		highlight: true,
		saveHTML: false,
		autoSave: true,
	};
	
	settings = Object.assign(defaultSettings, settings);

	this.container = document.getElementById(containerId);

	this.previewContainer = document.getElementById(settings.previewElementId);

	this.textarea = document.createElement("textarea");

	for (var tag in settings.tags) {
		var value = settings.tags[tag];
		this.textarea[tag] = value;
	}

	this.container.className += "chunchumaru-container";
	this.textarea.className += "chunchunmaru-editor";

	this.container.appendChild(this.textarea);

	this.getSelectedText = () => {
		return this.textarea.value.substring(this.textarea.selectionStart, this.textarea.selectionEnd);
	}

	// Keyboard & Undo Redo events
	var undoState = [''];
	var redoState = [];
	var maxSaveThreshold = 20;

	this.hotkeys = {
		'b': (event) => {
			if (event.ctrlKey) {
				var textarea = this.textarea;
				var content = textarea.value;
				var start = textarea.selectionStart;
				var end = textarea.selectionEnd;

				var boldText = "**" + this.getSelectedText() + "**";
				
				var preText = content.substring(0, start);
				var postText = content.substring(end, textarea.value.length);

				// new content
				this.textarea.value = preText + boldText + postText;
				this.textarea.selectionStart = start + 2;
				this.textarea.selectionEnd = start + 2;
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
}
