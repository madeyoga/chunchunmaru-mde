# chunchunmaru-mde
[![](https://data.jsdelivr.com/v1/package/npm/chunmde/badge)](https://www.jsdelivr.com/package/npm/chunmde)
![npm](https://img.shields.io/npm/dt/chunmde?style=flat-square)

Markdown editor based on [codemirror6](https://codemirror.net/)

[Demo page](https://madeyoga.github.io/chunchunmaru-mde/)

## Features
- Key bindings
- Toolbars
- Commands:
  - heading
  - italic <Ctrl+i>
  - bold <Ctrl+b>
  - quote <Ctrl+Shift+e>
  - code <Ctrl+e>
  - link <Ctrl+k>
  - Unordered list <Ctrl+Shift+8>

## Installation

```
npm i chunmde
```

## Usage

#### Browser
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Markdown editor in the browser</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chunmde@0.0.6/dist/chunmde.min.css">
</head>
<body>
  <div id="editor-container"></div>
  <script src="https://cdn.jsdelivr.net/npm/chunmde@0.0.6/dist/chunmde.bundle.min.js"></script>
  <script>
    const editor = new ChunMDE('editor-container')
    const value = editor.getValue()
    console.log(value)
  </script>
</body>
</html>
```

## Contribute
- [Fork the repository](https://github.com/madeyoga/chunchunmaru-mde.git)!
- Clone your fork: `git clone https://github.com/your-username/chunchunmaru-mde.git`
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :>
