![deprecated](https://img.shields.io/badge/status-deprecated-red.svg?style=plastic)

# resize

resize event for any DOM element with polling. [demo](http://ramitos.github.com/resize)

## install

```bash
$ component install ramitos/resize
```

## example

```js
var resize = require('resize');

resize.bind(document.getElementById('mytextarea'), function () {});
```

## api

#### bind(element, callback[, pollingInterval])

`pollingInterval` default is `250ms`

#### unbind(element, callback)

## license

MIT
